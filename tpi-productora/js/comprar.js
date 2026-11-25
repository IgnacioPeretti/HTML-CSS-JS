// Solo un USUARIO puede comprar; el resto es redirigido
protegerPagina("USUARIO");

const detalle = document.getElementById("detalle-evento");
const form = document.getElementById("form-compra");
const inputCantidad = document.getElementById("cantidad");
const totalEl = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

// El id del evento viaja en la URL: comprar.html?id=3
const eventoId = new URLSearchParams(window.location.search).get("id");

let evento = null;

const formatearPesos = (n) => "$" + Number(n).toLocaleString("es-AR");

const mostrarEvento = () => {
  detalle.innerHTML = `
    <div class="card">
      <img src="${evento.imagen}" class="card-img-top" alt="${evento.titulo}" />
      <div class="card-body">
        <h4>${evento.titulo}</h4>
        <p class="mb-1">📅 ${evento.fecha.slice(0, 10).split("-").reverse().join("/")}</p>
        <p class="mb-1">📍 ${evento.lugar}</p>
        <p class="mb-1">🎟️ Cupos disponibles: <strong>${evento.cuposDisponibles}</strong></p>
        <p class="mb-0">Precio por entrada: <strong>${formatearPesos(evento.precio)}</strong></p>
      </div>
    </div>`;
};

const actualizarTotal = () => {
  const cantidad = Number(inputCantidad.value) || 0;
  totalEl.textContent = formatearPesos(cantidad * evento.precio);
};

const mostrarMensaje = (texto, clase) => {
  mensaje.className = clase;
  mensaje.textContent = texto;
};

const confirmarCompra = async (e) => {
  e.preventDefault();
  try {
    const cantidad = Number(inputCantidad.value);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new Error("Ingresá una cantidad válida (1 o más)");
    }

    // Pedimos el evento de nuevo: los cupos pudieron cambiar mientras tanto
    const eventoActual = await getEvento(eventoId);
    if (cantidad > eventoActual.cuposDisponibles) {
      throw new Error(`Solo quedan ${eventoActual.cuposDisponibles} cupos disponibles`);
    }

    const sesion = getSesion();
    await crearTicket({
      userId: sesion.id,
      eventId: eventoActual.id,
      cantidad,
      total: cantidad * eventoActual.precio,
      estado: "Confirmado",
    });

    // Descontamos los cupos
    evento = await actualizarEvento(eventoActual.id, {
      cuposDisponibles: eventoActual.cuposDisponibles - cantidad,
    });

    mostrarEvento();
    inputCantidad.max = evento.cuposDisponibles;
    mostrarMensaje("¡Compra confirmada! Ya podés ver tus entradas.", "text-success");
    form.classList.add("d-none");
    detalle.insertAdjacentHTML(
      "afterend",
      `<a href="mis-entradas.html" class="btn btn-success w-100 mb-3">Ver mis entradas</a>`
    );
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
};

const iniciar = async () => {
  if (!eventoId) {
    window.location.href = "index.html";
    return;
  }
  try {
    evento = await getEvento(eventoId);
    mostrarEvento();

    if (evento.cuposDisponibles <= 0) {
      mostrarMensaje("Este evento está agotado.", "text-danger");
      return;
    }

    inputCantidad.max = evento.cuposDisponibles;
    form.classList.remove("d-none");
    actualizarTotal();
  } catch (error) {
    detalle.innerHTML = `<p class="text-danger">No se pudo cargar el evento: ${error.message}</p>`;
  }
};

inputCantidad.addEventListener("input", actualizarTotal);
form.addEventListener("submit", confirmarCompra);

iniciar();