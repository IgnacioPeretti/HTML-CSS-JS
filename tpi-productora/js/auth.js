const SESION_KEY = "sesion";

const guardarSesion = (usuario) => {
  const sesion = { id: usuario.id, nombre: usuario.nombre, role: usuario.role };
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
};

const getSesion = () => JSON.parse(localStorage.getItem(SESION_KEY));

const cerrarSesion = () => {
  localStorage.removeItem(SESION_KEY);
  window.location.href = "login.html";
};

const login = async (email, password) => {
  const usuarios = await getUsuarios();
  const usuario = usuarios.find((u) => u.email === email && u.password === password);
  if (!usuario) throw new Error("Email o contraseña incorrectos");
  guardarSesion(usuario);
  return usuario;
};

const registrar = async (nombre, email, password) => {
  const usuarios = await getUsuarios();
  if (usuarios.some((u) => u.email === email)) throw new Error("Ese email ya está registrado");
  return crearUsuario({ nombre, email, password, role: "USUARIO" });
};

const protegerPagina = (rolRequerido) => {
  const sesion = getSesion();
  if (!sesion) {
    window.location.href = "login.html";
  } else if (rolRequerido && sesion.role !== rolRequerido) {
    window.location.href = "index.html";
  }
};