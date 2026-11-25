const form = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const usuario = await login(
      document.getElementById("email").value,
      document.getElementById("password").value
    );
    window.location.href = usuario.role === "ADMIN" ? "admin-eventos.html" : "index.html";
  } catch (error) {
    mensaje.textContent = error.message;
  }
});