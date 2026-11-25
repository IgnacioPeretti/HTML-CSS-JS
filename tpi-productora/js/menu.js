// Qué opciones ve cada rol
const opcionesMenu = {
  INVITADO: [
    { texto: "Cartelera", href: "index.html" },
    { texto: "Iniciar sesión", href: "login.html" },
    { texto: "Registrarse", href: "registro.html" },
  ],
  USUARIO: [
    { texto: "Cartelera", href: "index.html" },
    { texto: "Mis entradas", href: "mis-entradas.html" },
  ],
  ADMIN: [
    { texto: "Eventos", href: "admin-eventos.html" },
    { texto: "Tickets", href: "admin-tickets.html" },
    { texto: "Usuarios", href: "admin-usuarios.html" },
    { texto: "Dashboard", href: "admin-dashboard.html" },
  ],
};

// Frases de la tira en movimiento
const frasesTira = [
  "COMPRA SEGURA",
  "TICKETS QUE SON EXPERIENCIAS",
  "ENTRADAS OFICIALES",
  "SUBZ0NE PRODUCCIONES",
];

// Devuelve el HTML de una tira; "clase" permite darle un estilo distinto
const crearTira = (clase = "") => {
  const grupo = [...frasesTira, ...frasesTira].map((f) => `<span>${f}</span>`).join("");
  return `
    <div class="tira ${clase}">
      <div class="tira-pista">
        <div class="tira-grupo">${grupo}</div>
        <div class="tira-grupo" aria-hidden="true">${grupo}</div>
      </div>
    </div>`;
};

const renderFooter = () => {
  if (document.getElementById("footer-marca")) return; // evita duplicarlo
  document.body.insertAdjacentHTML(
    "beforeend",
    `${crearTira("tira-pie")}
     <footer id="footer-marca" class="footer-marca">
       <div class="container">
         <strong>SUBZ0NE</strong> producciones · Venta de entradas para eventos y espectáculos
         <div class="small opacity-75">© 2026 SUBZ0NE producciones · TPI Programación III</div>
       </div>
     </footer>`
  );
};

const renderMenu = () => {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  const sesion = getSesion();
  const rol = sesion ? sesion.role : "INVITADO";

  const enlaces = opcionesMenu[rol]
    .map((o) => `<li class="nav-item"><a class="nav-link" href="${o.href}">${o.texto}</a></li>`)
    .join("");

  const zonaUsuario = sesion
    ? `<span class="navbar-text me-3">${sesion.nombre} (${sesion.role})</span>
       <button id="btn-salir" class="btn btn-outline-light btn-sm">Cerrar sesión</button>`
    : "";

  const menu = document.getElementById("menu");
  menu.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand marca" href="index.html">SUBZ0NE <span>producciones</span></a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav-contenido">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav-contenido">
          <ul class="navbar-nav me-auto">${enlaces}</ul>
          ${zonaUsuario}
        </div>
      </div>
    </nav>`;

  // Tira justo debajo del menú
  if (!document.querySelector(".tira-arriba")) {
    menu.insertAdjacentHTML("afterend", crearTira("tira-arriba"));
  }

  if (sesion) {
    document.getElementById("btn-salir").addEventListener("click", cerrarSesion);
  }

  renderFooter();
};