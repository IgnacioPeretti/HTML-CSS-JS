
const params = new URLSearchParams(window.location.search);
 
function cleanAndCap(str) {
  if (!str || !str.trim()) return null;
  const temp = str.trim();
  return temp[0].toUpperCase() + temp.substring(1);
}
 
const articulo = document.getElementById("pedido");
 
// Solo mostrar el resumen si se envió el formulario
if (params.has("tipo")) {
  const tiposCarne = {
    "carne-vacuna": "carne vacuna",
    "carne-pollo": "carne de pollo",
    "vegetariana": "vegetariana"
  };
 
  const tipo = params.get("tipo");
  const tipoCarne = tiposCarne[tipo] || tipo;
 
  const cantidad = params.get("cantidad") || "1";
  const conQueso = params.get("queso") === "si" ? "con queso" : "sin queso";
 
  const ingredientesSeleccionados = params.getAll("ingredientes");
  const ingredientes = ingredientesSeleccionados.length > 0
    ? "con " + ingredientesSeleccionados.join(", ")
    : "sin ingredientes extra";
 
  const aderezo = cleanAndCap(params.get("aderezo"));
  const textoAderezo = aderezo ? "aderezada con " + aderezo : "sin aderezo";
 
  const cocciones = { "1": "Poco cocida", "2": "Término medio", "3": "Bien cocida" };
  const puntoCoccion = cocciones[params.get("coccion")] || "Término medio";
 
  const comentario = (params.get("comentario") || "").trim() || "Sin comentarios";
 
  const p1 = document.createElement("p");
  p1.textContent = "El cliente solicitó " + cantidad + " hamburguesa(s) de " + tipoCarne + " " + conQueso + ", " + ingredientes + ", " + textoAderezo + ". Punto de cocción: " + puntoCoccion + ".";
 
  const p2 = document.createElement("p");
  p2.textContent = "Comentario del cliente: " + comentario;
 
  articulo.append(p1, p2);
}