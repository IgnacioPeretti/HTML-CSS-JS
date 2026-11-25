const form = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await registrar(
      document.getElementById("nombre").value.trim(),
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );
    mensaje.className = "text-success";
    mensaje.textContent = "¡Cuenta creada! Redirigiendo al login...";
    setTimeout(() => (window.location.href = "login.html"), 1500);
  } catch (error) {
    mensaje.className = "text-danger";
    mensaje.textContent = error.message;
  }
});