


function calcu_aviso() {
  var cantDias = parseFloat(document.getElementById("cantDias").value);
  var importeBase = parseFloat(document.getElementById("importeBase").value);
  var importeDiario = parseFloat(document.getElementById("importeDiario").value);

  var importeTotal = importeBase + (cantDias * importeDiario);

  document.getElementById("total").value = importeTotal;
  alert("El total es: $" + importeTotal);
}
 

//primero defino la función, y después le digo al botón que la use.

const boton = document.getElementById("boton");
boton.addEventListener("click", calcu_aviso, false);

  
