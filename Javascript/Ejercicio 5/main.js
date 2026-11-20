

//  Elementos principales y contadores

var lista = document.getElementById('notes-list');
var log = document.getElementById('log');
var campoTexto = document.getElementById('new-text');

var nextId = 4;   // note-1 a note-3 ya existen




//  Funciones auxiliares

function escribirLog(mensaje) {
  var linea = document.createElement('div');
  linea.textContent = mensaje;
  log.append(linea);
}

function crearNota(texto) {
  var li = document.createElement('li');
  li.textContent = texto;
  li.id = 'note-' + nextId;
  nextId++;
  return li;
}

// Lee el texto del campo; si está vacío avisa y devuelve null

function leerTexto() {
  var texto = campoTexto.value;
  if (texto === '') {
    escribirLog('Escribí un texto antes de usar el botón.');
    return null;
  }
  campoTexto.value = '';
  return texto;
}

//  Las 7 funciones 

function prependNote(text) {
  var nota = crearNota(text);
  lista.prepend(nota);
  escribirLog('Se agregó al inicio "' + text + '" (' + nota.id + ')');
}

function appendNote(text) {
  var nota = crearNota(text);
  lista.append(nota);
  escribirLog('Se agregó al final "' + text + '" (' + nota.id + ')');
}

function insertBeforeSecond(text) {
  var nota = crearNota(text);
  var segunda = lista.children[1];
  if (segunda === undefined) {
    lista.append(nota);
    escribirLog('No hay segunda nota, se agregó al final "' + text + '" (' + nota.id + ')');
  } else {
    segunda.before(nota);
    escribirLog('Se insertó "' + text + '" (' + nota.id + ') antes de la segunda nota');
  }
}

function insertAfterSecond(text) {
  var nota = crearNota(text);
  var segunda = lista.children[1];
  if (segunda === undefined) {
    lista.append(nota);
    escribirLog('No hay segunda nota, se agregó al final "' + text + '" (' + nota.id + ')');
  } else {
    segunda.after(nota);
    escribirLog('Se insertó "' + text + '" (' + nota.id + ') después de la segunda nota');
  }
}

function replaceAllNotes() {
  var n1 = crearNota('Nota genérica 1');
  var n2 = crearNota('Nota genérica 2');
  var n3 = crearNota('Nota genérica 3');
  lista.replaceChildren(n1, n2, n3);
  escribirLog('Se reemplazaron todas las notas por ' + n1.id + ', ' + n2.id + ' y ' + n3.id);
}

function replaceFirstNote(text) {
  var primera = lista.firstElementChild;
  if (primera === null) {
    escribirLog('No hay notas para reemplazar.');
    return;
  }
  var textoViejo = primera.textContent;
  var idViejo = primera.id;
  var nueva = crearNota(text);
  primera.replaceWith(nueva);
  escribirLog('Se reemplazó "' + textoViejo + '" (' + idViejo + ') por "' + text + '" (' + nueva.id + ')');
}

function removeLastNote() {
  var ultima = lista.lastElementChild;
  if (ultima === null) {
    escribirLog('No hay notas para eliminar.');
    return;
  }
  var textoEliminado = ultima.textContent;
  var idEliminado = ultima.id;
  ultima.remove();
  escribirLog('Se eliminó "' + textoEliminado + '" (' + idEliminado + ')');
}




//  Vincular los botones 



document.getElementById('btn-prepend').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    prependNote(texto);
  }
});

document.getElementById('btn-append').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    appendNote(texto);
  }
});

document.getElementById('btn-before').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    insertBeforeSecond(texto);
  }
});

document.getElementById('btn-after').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    insertAfterSecond(texto);
  }
});

document.getElementById('btn-replaceChildren').addEventListener('click', () => {
  replaceAllNotes();
});

document.getElementById('btn-replaceWith').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    replaceFirstNote(texto);
  }
});

document.getElementById('btn-remove').addEventListener('click', () => {
  removeLastNote();
});

document.getElementById('btn-add-custom').addEventListener('click', () => {
  var texto = leerTexto();
  if (texto !== null) {
    appendNote(texto);
  }
});