protegerPagina("USUARIO");

const lista = document.getElementById("lista-tickets");
const mensaje = document.getElementById("mensaje");

const formatearPesos = (n) => "$" + Number(n).toLocaleString("es-AR");
const formatearFecha = (f) => f.slice(0, 10).split("-").reverse().join("/");

// Color del estado
const claseEstado = {
  Confirmado: "bg-success",
  Utilizado: "bg-secondary",
  Cancelado: "bg-danger",
};

// Solo se puede cancelar si está confirmado y el evento todavía no pasó
const sePuedeCancelar = (ticket, evento) =>
  ticket.estado === "Confirmado" && evento && new Date(evento.fecha) > new Date();

const crearFila = (ticket) => {
  const evento = ticket.evento;
  const boton = sePuedeCancelar(ticket, evento)
    ? `<button class="btn btn-outline-danger btn-sm" data-id="${ticket.id}">Cancelar</button>`
    : "";

  return `
    <tr>
      <td>${evento ? evento.titulo : "Evento eliminado"}</td>
      <td>${evento ? formatearFecha(evento.fecha) : "-"}</td>
      <td>${evento ? evento.lugar : "-"}</td>
      <td>${ticket.cantidad}</td>
      <td>${formatearPesos(ticket.total)}</td>
      <td><span class="badge ${claseEstado[ticket.estado] || "bg-dark"}">${ticket.estado}</span></td>
      <td>${boton}</td>
    </tr>`;
};

const renderTickets = (tickets) => {
  if (tickets.length === 0) {
    lista.innerHTML = `<p class="text-muted">Todavía no compraste entradas. <a href="index.html">Ver cartelera</a></p>`;
    return;
  }
  lista.innerHTML = `
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>Evento</th><th>Fecha</th><th>Lugar</th>
          <th>Cantidad</th><th>Total</th><th>Estado</th><th></th>
        </tr>
      </thead>
      <tbody>${tickets.map(crearFila).join("")}</tbody>
    </table>`;
};

// Cruce en memoria: a cada ticket del usuario le pegamos su evento
const cargarTickets = async () => {
  try {
    const sesion = getSesion();
    const [tickets, eventos] = await Promise.all([getTickets(), getEventos()]);

    const misTickets = tickets
      .filter((t) => String(t.userId) === String(sesion.id))
      .map((t) => ({
        ...t,
        evento: eventos.find((e) => String(e.id) === String(t.eventId)),
      }));

    renderTickets(misTickets);
  } catch (error) {
    lista.innerHTML = `<p class="text-danger">No se pudieron cargar tus entradas: ${error.message}</p>`;
  }
};

const cancelarTicket = async (ticketId) => {
  if (!confirm("¿Seguro que querés cancelar esta entrada?")) return;
  try {
    const ticket = (await getTickets()).find((t) => String(t.id) === String(ticketId));
    if (!ticket || ticket.estado !== "Confirmado") {
      throw new Error("Esta entrada ya no se puede cancelar");
    }

    await actualizarTicket(ticket.id, { estado: "Cancelado" });

    // Devolvemos los cupos al evento
    const evento = await getEvento(ticket.eventId);
    await actualizarEvento(evento.id, {
      cuposDisponibles: evento.cuposDisponibles + ticket.cantidad,
    });

    mensaje.className = "text-success";
    mensaje.textContent = "Entrada cancelada. Los cupos fueron devueltos.";
    cargarTickets();
  } catch (error) {
    mensaje.className = "text-danger";
    mensaje.textContent = error.message;
  }
};

// Un solo listener para todos los botones Cancelar (delegación de eventos)
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-id]");
  if (boton) cancelarTicket(boton.dataset.id);
});

cargarTickets();