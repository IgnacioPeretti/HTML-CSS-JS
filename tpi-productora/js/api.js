const BASE_URL = "https://6b04d06fdb01cf463607a2e2.mockapi.io/api/version1";

const request = async (recurso, opciones = {}) => {
  const respuesta = await fetch(`${BASE_URL}/${recurso}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  return respuesta.json();
};

// Usuarios
const getUsuarios = () => request("usuarios");
const crearUsuario = (usuario) =>
  request("usuarios", { method: "POST", body: JSON.stringify(usuario) });
const actualizarUsuario = (id, datos) =>
  request(`usuarios/${id}`, { method: "PUT", body: JSON.stringify(datos) });

// Eventos
const getEventos = () => request("eventos");
const getEvento = (id) => request(`eventos/${id}`);
const crearEvento = (evento) =>
  request("eventos", { method: "POST", body: JSON.stringify(evento) });
const actualizarEvento = (id, datos) =>
  request(`eventos/${id}`, { method: "PUT", body: JSON.stringify(datos) });
const eliminarEvento = (id) => request(`eventos/${id}`, { method: "DELETE" });

// Tickets
const getTickets = () => request("tickets");
const crearTicket = (ticket) =>
  request("tickets", { method: "POST", body: JSON.stringify(ticket) });
const actualizarTicket = (id, datos) =>
  request(`tickets/${id}`, { method: "PUT", body: JSON.stringify(datos) });
const eliminarTicket = (id) => request(`tickets/${id}`, { method: "DELETE" });
