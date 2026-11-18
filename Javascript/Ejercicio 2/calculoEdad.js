

function calcular() {


  // leer los datos
  var nombre = document.getElementById("nombre").value;
  var anioNacimiento = parseInt(document.getElementById("anio").value);

  // calcular la edad
  var edad = new Date().getFullYear() - anioNacimiento;

  // grupo
  var grupo;
  if (edad < 18) {
    grupo = "A";
  } else if (edad <= 34) {
    grupo = "B";
  } else if (edad <= 54) {
    grupo = "C";
  } else {
    grupo = "D";
  }

  // resultados

  document.getElementById("resEstudiante").value = nombre;
  document.getElementById("resEdad").value = edad;
  document.getElementById("resGrupo").value = grupo;
}


var boton = document.getElementById("boton");
boton.addEventListener("click", calcular, false);

  
