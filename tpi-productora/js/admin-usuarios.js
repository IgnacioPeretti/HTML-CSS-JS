protegerPagina("ADMIN");

const formUsuario = document.getElementById("form-usuario");
const formPassword = document.getElementById("form-password");
const lista = document.getElementById("lista-usuarios");
const mensaje = document.getElementById("mensaje");

const inputPasswordId = document.getElementById("password-id");
const inputNueva = document.getElementById("nueva-password");
const btnPassword = document.getElementById("btn-password");
const textoSeleccionado = document.getElementById("usuario-seleccionado");

let usuarios = [];

const mostrarMensaje = (texto, clase) => {
  mensaje.className = clase;
  mensaje.textContent = texto;
};

// ---------- TABLA ----------
// Ojo: nunca mostramos la password en la tabla
const crearFila = (u) => `
  <tr>
    <td>${u.nombre}</td>
    <td>${u.email}</td>
    <td><span class="badge ${u.role === "ADMIN" ? "bg-danger" : "bg-primary"}">${u.role}</span></td>
    <td>
      <button class="btn btn-outline-warning btn-sm" data-id="${u.id}">Cambiar password</button>
    </td>
  </tr>`;

const renderUsuarios = () => {
  lista.innerHTML = `
    <table class="table table-striped align-middle">
      <thead>
        <tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr>
      </thead>
      <tbody>${usuarios.map(crearFila).join("")}</tbody>
    </table>`;
};

const cargarUsuarios = async () => {
  try {
    usuarios = await getUsuarios();
    renderUsuarios();
  } catch (error) {
    lista.innerHTML = `<p class="text-danger">No se pudieron cargar los usuarios: ${error.message}</p>`;
  }
};

// ---------- CREAR USUARIO ----------
const crearNuevoUsuario = async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("email").value.trim();

    // Revisamos con los datos más recientes que el email no exista
    const actuales = await getUsuarios();
    if (actuales.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Ya existe un usuario con ese email");
    }

    await crearUsuario({
      nombre: document.getElementById("nombre").value.trim(),
      email,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
    });

    formUsuario.reset();
    mostrarMensaje("Usuario creado correctamente", "text-success");
    cargarUsuarios();
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
};

// ---------- CAMBIAR PASSWORD ----------
const seleccionarUsuario = (id) => {
  const u = usuarios.find((x) => String(x.id) === String(id));
  if (!u) return;
  inputPasswordId.value = u.id;
  textoSeleccionado.textContent = `Usuario: ${u.nombre} (${u.email})`;
  inputNueva.disabled = false;
  btnPassword.disabled = false;
  inputNueva.focus();
};

const cambiarPassword = async (e) => {
  e.preventDefault();
  try {
    const nueva = inputNueva.value;
    if (nueva.length < 4) throw new Error("La contraseña debe tener al menos 4 caracteres");

    await actualizarUsuario(inputPasswordId.value, { password: nueva });

    formPassword.reset();
    inputPasswordId.value = "";
    inputNueva.disabled = true;
    btnPassword.disabled = true;
    textoSeleccionado.textContent = 'Elegí un usuario de la lista con el botón "Cambiar password".';
    mostrarMensaje("Contraseña actualizada", "text-success");
  } catch (error) {
    mostrarMensaje(error.message, "text-danger");
  }
};

// ---------- EVENTOS DEL DOM ----------
formUsuario.addEventListener("submit", crearNuevoUsuario);
formPassword.addEventListener("submit", cambiarPassword);

lista.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-id]");
  if (boton) seleccionarUsuario(boton.dataset.id);
});

cargarUsuarios();