

var card = document.getElementById('card');
var log = document.getElementById('log');




function escribirLog(mensaje) {
  var linea = document.createElement('div');
  linea.textContent = mensaje;
  log.appendChild(linea);
}


// Agregar un elemento antes de la tarjeta

function agregarElementoAntes() {
  var nuevo = document.createElement('div');
  nuevo.textContent = 'Elemento agregado antes de la tarjeta';
  card.insertAdjacentElement('beforebegin', nuevo);
  escribirLog('Se agregó un elemento antes de la tarjeta (beforebegin)');
}

document.getElementById('btn-element-before').addEventListener('click', agregarElementoAntes);



// Agregar un elemento después de la tarjeta

function agregarHTMLDespuesDeInicio() {
    card.insertAdjacentHTML('afterbegin', '<p>Nuevo <strong>contenido</strong> HTML</p>');
    escribirLog('Se agregó HTML al inicio de la tarjeta (afterbegin)');
}

document.getElementById('btn-html-after').addEventListener('click', agregarHTMLDespuesDeInicio);


// Agregar un elemento al final de la tarjeta

function agregarTextoAlFinal() {
  card.insertAdjacentText('beforeend', ' Texto agregado al final con insertAdjacentText.');
  escribirLog('Se agregó texto al final de la tarjeta (beforeend)');
}

document.getElementById('btn-text-end').addEventListener('click', agregarTextoAlFinal);