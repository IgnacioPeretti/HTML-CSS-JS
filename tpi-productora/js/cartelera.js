const contenedor = document.getElementById("cartelera");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");

let eventos = []; // acá guardamos todos los eventos una sola vez

// Según quién mira, el botón de la card cambia
const botonCompra = (evento) => {
  const sesion = getSesion();
  if (evento.cuposDisponibles <= 0) {
    return `<button class="btn btn-secondary w-100" disabled>Agotado</button>`;
  }
  if (!sesion) {
    return `<a href="login.html" class="btn btn-outline-primary w-100">Iniciá sesión para comprar</a>`;
  }
  if (sesion.role === "ADMIN") return "";
  return `<a href="comprar.html?id=${evento.id}" class="btn btn-primary w-100">Comprar</a>`;
};

const formatearFecha = (fecha) => fecha.slice(0, 10).split("-").reverse().join("/");

const crearCard = (evento) => `
  <div class="col">
    <div class="card h-100 shadow-sm">
      <img src="${evento.imagen}" class="card-img-top" alt="${evento.titulo}" />
      <div class="card-body d-flex flex-column">
        <span class="badge align-self-start mb-2">${evento.categoria}</span>
        <h5 class="card-title">${evento.titulo}</h5>
        <p class="mb-1"><strong>Fecha:</strong> ${formatearFecha(evento.fecha)}</p>
        <p class="mb-1"><strong>Lugar:</strong> ${evento.lugar}</p>
        <p class="mb-1"><strong>Cupos:</strong> ${evento.cuposDisponibles}</p>
        <p class="fw-bold fs-5 mt-auto">$${Number(evento.precio).toLocaleString("es-AR")}</p>
        ${botonCompra(evento)}
      </div>
    </div>
  </div>`;

const renderEventos = (lista) => {
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">No se encontraron eventos.</p>`;
    return;
  }
  contenedor.innerHTML = lista.map(crearCard).join("");
};

// Llena el select con las categorías que existen, sin repetir
const cargarCategorias = () => {
  const categorias = [...new Set(eventos.map((e) => e.categoria))];
  categorias.forEach((cat) => {
    filtroCategoria.insertAdjacentHTML("beforeend", `<option value="${cat}">${cat}</option>`);
  });
};

// Aplica buscador y categoría juntos
const filtrar = () => {
  const texto = buscador.value.toLowerCase().trim();
  const categoria = filtroCategoria.value;

  const filtrados = eventos.filter(
    (e) =>
      e.titulo.toLowerCase().includes(texto) &&
      (categoria === "" || e.categoria === categoria)
  );
  renderEventos(filtrados);
};

const iniciar = async () => {
  try {
    eventos = await getEventos();
    cargarCategorias();
    renderEventos(eventos);
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">No se pudieron cargar los eventos: ${error.message}</p>`;
  }
};

buscador.addEventListener("input", filtrar);
filtroCategoria.addEventListener("change", filtrar);

iniciar();