

function modificar() {


  // 1. La cabecera (el <a> que está dentro del <header>)
  var cabecera = document.querySelector("header a");
  cabecera.id = "cabecera";
  cabecera.setAttribute("href", "https://www.google.com");
  cabecera.innerHTML = '<i style="background-color: yellow;">NUEVO</i> ' + '<b style="background-color: lightblue;">TITULO</b>';

  
  // 2. El elemento con clase elemB
  var elemB = document.querySelector(".elemB");
  elemB.style.fontFamily = "'Lucida Sans'";
  elemB.style.fontSize = "10px";

  
  
  // 3. El span linea1
  var linea1 = document.getElementById("linea1");
  linea1.textContent = "ADECUADO PARA TODOS LOS QUE TENGAN INTERÉS";
  linea1.style.color = "green";

  
  
  // 4. Reemplazar el div elemC por un párrafo en negrita
  var elemC = document.querySelector(".elemC");
  elemC.outerHTML = "<p><b>TERCER PARRAFO</b></p>";

  
  
  // 5. Agregar al final de la seccion3
  var seccion3 = document.getElementById("seccion3");
  var nuevoArticle = document.createElement("article");
  var nuevoP = document.createElement("p");
  nuevoP.textContent = "PARRAFO FINAL";
  nuevoArticle.appendChild(nuevoP);
  seccion3.appendChild(nuevoArticle);
}

var boton = document.getElementById("boton");
boton.addEventListener("click", modificar, false);