protegerPagina("ADMIN");

const form = document.getElementById("form-evento");
const tituloForm = document.getElementById("titulo-form");
const btnCancelar = document.getElementById("btn-cancelar");
const lista = document.getElementById("lista-eventos");
const mensaje = document.getElementById("mensaje");

const campos = {
  id: document.getElementById("evento-id"),
  titulo: document.getElementById("titulo"),
  categoria: document.getElementById("categoria"),
  fecha: document.getElementById("fecha"),
  lugar: document.getElementById("lugar"),
  precio: document.getElementById("precio"),
  cupos: document.getElementById("cupos"),
  imagen: document.getElementById("imagen"),
};

let eventos = [];

const formatearPesos = (n) => "$" + Number(n).toLocaleString("es-AR");
const formatearFecha = (f) => f.slice(0, 10).split("-").reverse().join("/");

const mostrarMensaje = (texto, clase) => {
  mensaje.className = clase;
  mensaje.textContent = texto;
};

// ---------- TABLA ----------
const crearFila = (e) => `
  <tr>
    <td>${e.titulo}</td>
    <td>${e.categoria}</td>
    <td>${formatearFecha(e.fecha)}</td>
    <td>${e.lugar}</td>
    <td>${formatearPesos(e.precio)}</td>
    <td>${e.cuposDisponibles}</td>
    <td class="text-nowrap">
      <button class="btn btn-outline-primary btn-sm" data-accion="editar" data-id="${e.id}">Editar</button>
      <button class="btn btn-outline-danger btn-sm" data-accion="eliminar" data-id="${e.id}">Eliminar</button>
    </td>
  </tr>`;

const renderEventos = () => {
  if (eventos.length === 0) {
    lista.innerHTML = `<p class="text-muted">No hay eventos cargados.</p>`;
    return;
  }
  lista.innerHTML = `
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>Título</th><th>Categoría</th><th>Fecha</th><th>Lugar</th>
          <th>Precio</th><th>Cupos</th><th></th>
        </tr>
      </thead>
      <tbody>${eventos.map(crearFila).join("")}</tbody>
    </table>`;
};

const cargarEventos = async () => {
  try {
    eventos = await getEventos();
    renderEventos();
  } catch (error) {
    lista.innerHTML = `<p class="text-danger">No se pudieron cargar los eventos: ${error.message}</p>`;
  }
};

// ---------- FORMULARIO ----------
const limpiarForm = () => {
  form.reset();
  campos.id.value = "";
  tituloForm.textContent = "Nuevo evento";
  btnCancelar.classList.add("d-none");
};

// Pasa un evento a los campos del formulario para editarlo
const editarEvento = (id) => {
  const e = eventos.find((ev) => String(ev.id) === String(id));
  if (!e) return;
  campos.id.value = e.id;
  campos.titulo.value = e.titulo;
  campos.categoria.value = e.categoria;
  campos.fecha.value = e.fecha.slice(0, 10);
  campos.lugar.value = e.lugar;
  campos.precio.value = e.precio;
  campos.cupos.value = e.cuposDisponibles;
  campos.imagen.value = e.imagen;
  tituloForm.textContent = "Editar evento";
  btnCancelar.classList.remove("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const guardarEvento = async (e) => {
  e.preventDefault();
  try {
    const datos = {
      titulo: campos.titulo.value.trim(),
      categoria: campos.categoria.value.trim(),
      fecha: campos.fecha.value,
      lugar: campos.lugar.value.trim(),
      precio: Number(campos.precio.value),
      cuposDisponibles: Number(campos.cupos.value),
      imagen: campos.imagen.value.trim(),
    };

    if (datos.precio < 0 || !Number.isInteger(datos.cuposDisponibles) || datos.cuposDisponibles < 0) {
      throw new Error("El precio y los cupos no pueden ser negativos");
    }

    // Si hay id estamos editando; si no, creando
    if (campos.id.value) {
      await actualizarEvento(campos.id.value, datos);
      mostrarMensaje("Evento actualizado", "text-success");
    } else {
      await crearEvento(datos);
      mostrarMensaje("Evento creado", "text-success");
    }

    limpiarForm();
    cargarEventos();
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
};

// ---------- ELIMINAR ----------
const borrarEvento = async (id) => {
  try {
    // No se puede borrar un evento que ya tiene entradas vendidas
    const tickets = await getTickets();
    if (tickets.some((t) => String(t.eventId) === String(id))) {
      throw new Error("No se puede eliminar: el evento tiene entradas vendidas");
    }
    if (!confirm("¿Seguro que querés eliminar este evento?")) return;

    await eliminarEvento(id);
    mostrarMensaje("Evento eliminado", "text-success");
    cargarEventos();
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
};

// ---------- EVENTOS DEL DOM ----------
form.addEventListener("submit", guardarEvento);
btnCancelar.addEventListener("click", limpiarForm);

// Un solo listener para los botones Editar y Eliminar de la tabla
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;
  if (boton.dataset.accion === "editar") editarEvento(boton.dataset.id);
  if (boton.dataset.accion === "eliminar") borrarEvento(boton.dataset.id);
});

cargarEventos();