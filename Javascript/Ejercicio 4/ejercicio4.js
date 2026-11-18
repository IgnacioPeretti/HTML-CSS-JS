


//  Parte 1: elementos principales y contadores

var lista = document.getElementById('todo-list');
var log = document.getElementById('log');
var campoTexto = document.getElementById('new-text');

var nextId = 4;          // los ids item-1 a item-3 ya existen
var nextReplacedId = 1;  // para item-replaced-1, item-replaced-2


//  Parte 2: las 4 funciones



function appendTask(text) {
  var nuevo = crearItem(text, 'item-' + nextId);
  nextId++;
  lista.appendChild(nuevo);
  escribirLog('Se agregó "' + text + '" con id ' + nuevo.id);
}

function removeLastTask() {
  var ultimo = lista.lastElementChild;
  if (ultimo === null) {
    escribirLog('No hay tareas para eliminar.');
    return;
  }
  var textoEliminado = ultimo.textContent;   // guardo el texto antes de borrar
  var idEliminado = ultimo.id;
  lista.removeChild(ultimo);
  escribirLog('Se eliminó "' + textoEliminado + '" (' + idEliminado + ')');
}

function replaceFirstTask(newText) {
  var primero = lista.firstElementChild;
  if (primero === null) {
    escribirLog('No hay tareas para reemplazar.');
    return;
  }
  var textoViejo = primero.textContent;
  var idViejo = primero.id;

  var nuevo = crearItem(newText, 'item-replaced-' + nextReplacedId);
  nextReplacedId++;
  lista.replaceChild(nuevo, primero);

  escribirLog('Se reemplazó "' + textoViejo + '" (' + idViejo + ') por "' +
              newText + '" (' + nuevo.id + ')');
}

function insertBeforeSecond(text) {
  var nuevo = crearItem(text, 'item-' + nextId);
  nextId++;
  if (lista.children.length < 2) {
    lista.appendChild(nuevo);
    escribirLog('Había menos de 2 tareas, se agregó "' + text + '" al final (' + nuevo.id + ')');
  } else {
    lista.insertBefore(nuevo, lista.children[1]);
    escribirLog('Se insertó "' + text + '" (' + nuevo.id + ') antes de la segunda tarea');
  }
}


//  Funciones auxiliares

function escribirLog(mensaje) {
  var linea = document.createElement('div');
  linea.textContent = mensaje;
  log.appendChild(linea);
}

function crearItem(texto, id) {
  var li = document.createElement('li');
  li.textContent = texto;
  li.id = id;
  return li;
}




//  Parte 3: vincular los botones


document.getElementById('btn-add').addEventListener('click', () => {
  var texto = campoTexto.value;
  if (texto === '') {
    escribirLog('Escribí un texto antes de agregar.');
    return;
  }
  appendTask(texto);
  campoTexto.value = '';
});

document.getElementById('btn-insert').addEventListener('click', () => {
  var texto = campoTexto.value;
  if (texto === '') {
    escribirLog('Escribí un texto antes de insertar.');
    return;
  }
  insertBeforeSecond(texto);
  campoTexto.value = '';
});

document.getElementById('btn-replace').addEventListener('click', () => {
  var texto = campoTexto.value;
  if (texto === '') {
    escribirLog('Escribí un texto antes de reemplazar.');
    return;
  }
  replaceFirstTask(texto);
  campoTexto.value = '';
});

document.getElementById('btn-remove').addEventListener('click', () => {
  removeLastTask();
});

document.getElementById('btn-add-custom').addEventListener('click', () => {
  var texto = campoTexto.value;
  if (texto === '') {
    escribirLog('Escribí un texto antes de agregar.');
    return;
  }
  appendTask(texto);
  campoTexto.value = '';
});

document.getElementById('btn-clear-log').addEventListener('click', () => {
  log.textContent = '';
});