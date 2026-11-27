// Si alguien entra sin sesión lo manda al login, y si es admin lo manda al inicio,
//  porque solo el usuario común puede comprar.

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

  // arma la card con innerHTML
  detalle.innerHTML = `
    <div class="card">
      <img src="${evento.imagen}" class="card-img-top" alt="${evento.titulo}" />
      <div class="card-body">
        <h4>${evento.titulo}</h4>
        <p class="mb-1"><strong>Fecha:</strong> ${evento.fecha.slice(0, 10).split("-").reverse().join("/")}</p>
        <p class="mb-1"><strong>Lugar:</strong> ${evento.lugar}</p>
        <p class="mb-1"><strong>Cupos disponibles:</strong> ${evento.cuposDisponibles}</p>
        <p class="mb-0"><strong>Precio por entrada:</strong> ${formatearPesos(evento.precio)}</p>
      </div>
    </div>`;
};



// Evento input: cada vez que el usuario escribe la cantidad se ejecuta actualizarTotal,
// que multiplica cantidad por precio y lo muestra con textContent. Es en tiempo real, sin enviar nada.

const actualizarTotal = () => {
  const cantidad = Number(inputCantidad.value) || 0;
  totalEl.textContent = formatearPesos(cantidad * evento.precio);
};

const mostrarMensaje = (texto, clase) => {
  mensaje.className = clase;
  mensaje.textContent = texto;
};


// El segundo es submit, cuando confirma. Se ejecuta confirmarCompra, que es una función async.
// Empieza con preventDefault para que el formulario no recargue la página.
// Después valida que la cantidad sea un entero mayor o igual a 1.

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


    // Si todo está bien, hago dos llamadas en orden. Con crearTicket hago un POST con el userId de la sesión,
    // el eventId, la cantidad, el total y el estado Confirmado.
    // Y con actualizarEvento hago un PUT que descuenta los cupos.

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

//la función iniciar pide el evento con getEvento y lo dibuja con mostrarEvento, que arma la card con innerHTML.
//Si no quedan cupos muestra Agotado y no aparece el formulario.
//Si hay cupos, le pone el máximo al input y lo muestra sacándole la clase


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