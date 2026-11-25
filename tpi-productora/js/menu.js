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

const renderMenu = () => {
  const sesion = getSesion();
  const rol = sesion ? sesion.role : "INVITADO";

  const enlaces = opcionesMenu[rol]
    .map((o) => `<li class="nav-item"><a class="nav-link" href="${o.href}">${o.texto}</a></li>`)
    .join("");

  const zonaUsuario = sesion
    ? `<span class="navbar-text me-3">${sesion.nombre} (${sesion.role})</span>
       <button id="btn-salir" class="btn btn-outline-light btn-sm">Cerrar sesión</button>`
    : "";

  document.getElementById("menu").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="index.html">Entradas</a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav-contenido">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav-contenido">
          <ul class="navbar-nav me-auto">${enlaces}</ul>
          ${zonaUsuario}
        </div>
      </div>
    </nav>`;

  if (sesion) {
    document.getElementById("btn-salir").addEventListener("click", cerrarSesion);
  }
};