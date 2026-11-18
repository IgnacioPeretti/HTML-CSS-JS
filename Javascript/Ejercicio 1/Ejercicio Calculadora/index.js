
const nombre = prompt("Ingrese el nombre del empleado:");
const sueldoBasico = parseFloat(prompt("Ingrese el sueldo básico:"));

const jubilacion = 0.11;
const obraSocial = 0.03;

const descuentoJubilacion = sueldoBasico * jubilacion;
const descuentoObraSocial = sueldoBasico * obraSocial;

const sueldoNeto = sueldoBasico - descuentoJubilacion - descuentoObraSocial;

console.log("Nombre del empleado: " + nombre);
console.log("Sueldo básico: $" + sueldoBasico);
console.log("Descuento por jubilación (11%): $" + descuentoJubilacion);
console.log("Descuento por obra social (3%): $" + descuentoObraSocial);
console.log("Sueldo neto: $" + sueldoNeto);

alert(`Empleado: ${nombre}
Sueldo básico: $${sueldoBasico.toFixed(2)}
Jubilación (11%): $${descuentoJubilacion.toFixed(2)}
Obra social (3%): $${descuentoObraSocial.toFixed(2)}
Sueldo neto: $${sueldoNeto.toFixed(2)}`);
