protegerPagina("ADMIN");

const lista = document.getElementById("lista-tickets");
const mensaje = document.getElementById("mensaje");
const filtroEstado = document.getElementById("filtro-estado");

const ESTADOS = ["Confirmado", "Utilizado", "Cancelado"];

let tickets = []; // tickets ya cruzados con su usuario y su evento

const formatearPesos = (n) => "$" + Number(n).toLocaleString("es-AR");

const mostrarMensaje = (texto, clase) => {
  mensaje.className = clase;
  mensaje.textContent = texto;
};

// ---------- TABLA ----------
const crearSelectEstado = (ticket) => `
  <select class="form-select form-select-sm" data-id="${ticket.id}">
    ${ESTADOS.map(
      (e) => `<option value="${e}" ${e === ticket.estado ? "selected" : ""}>${e}</option>`
    ).join("")}
  </select>`;

// Se puede eliminar del historial si no ocupa cupos (cancelado) o si su evento ya no existe
const sePuedeEliminar = (t) => !t.evento || t.estado === "Cancelado";

const crearBotonEliminar = (t) =>
  sePuedeEliminar(t)
    ? `<button class="btn btn-outline-danger btn-sm" data-eliminar="${t.id}">Eliminar</button>`
    : "";

const crearFila = (t) => `
  <tr>
    <td>${t.id}</td>
    <td>${t.usuario ? t.usuario.nombre : "Usuario eliminado"}</td>
    <td>${t.evento ? t.evento.titulo : "Evento eliminado"}</td>
    <td>${t.cantidad}</td>
    <td>${formatearPesos(t.total)}</td>
    <td>${crearSelectEstado(t)}</td>
    <td>${crearBotonEliminar(t)}</td>
  </tr>`;

const renderTickets = () => {
  const estado = filtroEstado.value;
  const filtrados = estado ? tickets.filter((t) => t.estado === estado) : tickets;

  if (filtrados.length === 0) {
    lista.innerHTML = `<p class="text-muted">No hay tickets para mostrar.</p>`;
    return;
  }
  lista.innerHTML = `
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>#</th><th>Usuario</th><th>Evento</th>
          <th>Cantidad</th><th>Total</th><th>Estado</th><th></th>
        </tr>
      </thead>
      <tbody>${filtrados.map(crearFila).join("")}</tbody>
    </table>`;
};

// Cruce en memoria: a cada ticket le pegamos su usuario y su evento
const cargarTickets = async () => {
  try {
    const [listaTickets, usuarios, eventos] = await Promise.all([
      getTickets(),
      getUsuarios(),
      getEventos(),
    ]);

    tickets = listaTickets.map((t) => ({
      ...t,
      usuario: usuarios.find((u) => String(u.id) === String(t.userId)),
      evento: eventos.find((e) => String(e.id) === String(t.eventId)),
    }));
    renderTickets();
  } catch (error) {
    lista.innerHTML = `<p class="text-danger">No se pudieron cargar los tickets: ${error.message}</p>`;
  }
};

// ---------- CAMBIO DE ESTADO ----------
// Un ticket "ocupa" cupos mientras no esté cancelado
const ocupaCupos = (estado) => estado !== "Cancelado";

const cambiarEstado = async (ticketId, nuevoEstado) => {
  try {
    const ticket = tickets.find((t) => String(t.id) === String(ticketId));
    const estadoAnterior = ticket.estado;
    if (estadoAnterior === nuevoEstado) return;

    // Si cambia entre ocupar o no cupos, hay que ajustar el evento
    // (si el evento ya fue eliminado, no hay cupos que ajustar)
    if (ocupaCupos(estadoAnterior) !== ocupaCupos(nuevoEstado) && ticket.evento) {
      const evento = await getEvento(ticket.eventId);

      if (nuevoEstado === "Cancelado") {
        // Se cancela: devolvemos los cupos
        await actualizarEvento(evento.id, {
          cuposDisponibles: evento.cuposDisponibles + ticket.cantidad,
        });
      } else {
        // Se reactiva un ticket cancelado: tienen que alcanzar los cupos
        if (ticket.cantidad > evento.cuposDisponibles) {
          throw new Error(`No se puede reactivar: solo quedan ${evento.cuposDisponibles} cupos`);
        }
        await actualizarEvento(evento.id, {
          cuposDisponibles: evento.cuposDisponibles - ticket.cantidad,
        });
      }
    }

    await actualizarTicket(ticket.id, { estado: nuevoEstado });
    mostrarMensaje(`Ticket #${ticket.id} pasó a "${nuevoEstado}"`, "text-success");
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
  cargarTickets(); // recarga siempre, así el select vuelve al valor real si falló
};

// ---------- ELIMINAR TICKET ----------
const borrarTicket = async (ticketId) => {
  try {
    const ticket = tickets.find((t) => String(t.id) === String(ticketId));
    if (!ticket || !sePuedeEliminar(ticket)) {
      throw new Error("Solo se pueden eliminar tickets cancelados o de eventos eliminados");
    }
    if (!confirm("¿Eliminar este ticket del historial?")) return;

    await eliminarTicket(ticket.id);
    mostrarMensaje(`Ticket #${ticket.id} eliminado del historial`, "text-success");
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
  cargarTickets();
};

// ---------- EVENTOS DEL DOM ----------
filtroEstado.addEventListener("change", renderTickets);

// Un solo listener para todos los selects de estado de la tabla
lista.addEventListener("change", (e) => {
  const select = e.target.closest("select[data-id]");
  if (select) cambiarEstado(select.dataset.id, select.value);
});

// Un solo listener para todos los botones Eliminar de la tabla
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-eliminar]");
  if (boton) borrarTicket(boton.dataset.eliminar);
});

cargarTickets();