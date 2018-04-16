'use strict';
// Initialize Firebase
// Ces infos sont obtenu via la page https://console.firebase.google.com/
// Une icône "Ajouter Firebase à votre application Web" est clickable et vous
// donne cette partie de script Ici le projet que j'ai créé s'appelle
// justineproject
var config = {
  apiKey: 'AIzaSyC_AIlKai-UM1msZoaMFBnjKD4gmQlIWKE',
  authDomain: 'justineproject-2ba49.firebaseapp.com',
  databaseURL: 'https://justineproject-2ba49.firebaseio.com',
  projectId: 'justineproject-2ba49',
  storageBucket: 'justineproject-2ba49.appspot.com',
  messagingSenderId: '805842259265'
};
firebase.initializeApp(config);
// SIGN ANONYMOUS USER ----
firebase.auth().onAuthStateChanged(function(user) {
  console.log('onAuthStateChanged');
  if (user) {
    console.log(user);
    // User is signed in.
    let isAnonymous = user.isAnonymous;
    let uid = user.uid;
    // console.log(uid);
  } else {
    // No user is signed in.
  }
});
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  console.log('anonymously auth error ----- ' + errorCode);
  console.log(errorCode);
});


// on initialise la base données
let database = firebase.database();

// on check si on est dans la page master ou pas
// MASTER
let isMaster = (document.body.classList.contains('master')) ? true : false;

// on initialise un delay par default
let delay = 100;
// on ajoute les boutons si on est la page MASTER
// et on supprime le delay si on est la page MASTER
if (isMaster) {
  let button = document.createElement('button');
  button.innerHTML = 'Start sequence';
  button.addEventListener('click', onClick);
  document.body.appendChild(button);
  //
  let button2 = document.createElement('button');
  button2.innerHTML = 'Stop sequence';
  button2.addEventListener('click', onClickStop);
  document.body.appendChild(button2);
  delay = 0;
}

// on initialise un interval si on le MASTER
// ici un interval de 1 sec
let interval;
function onClick(e) {
  interval = setInterval(sendSignal, 1000);
}
// function pour stopper l'interval
function onClickStop(e) {
  clearInterval(interval);
}

// la function activée par l'interval
// on active la page d'une couleur
// on la désactive après 500 milliseconde
// ATTENTION ici on ne gère pas le delay, car on est le master
function sendSignal() {
  sendMessage('ACTIVATE', 1);
  setTimeout(function() {
    sendMessage('ACTIVATE', 0);
  }, 500);
}

// function pour envoyer des datas au serveur (websocket)
function sendMessage(_type, _data = 'yes') {
  // _data = {'data': _data, 't_created': Date.now()};
  database.ref(_type).set(_data);
}

// function de callback au cas où les websockets renvoient une info
// CALLBACK
database.ref('ACTIVATE').on('value', function(snapshot) {
  let value = snapshot.val();
  if (value == 1) {
    // on ajoute un delay
    // pour le MASTER le delay sera 0
    // pour le slave ça sera 100 milliseconde
    setTimeout(function() {
      document.body.style.backgroundColor = 'black';
    }, delay);
  } else {
    // on ajoute un delay
    // pour le MASTER le delay sera 0
    // pour le slave ça sera 100 milliseconde
    setTimeout(function() {
      document.body.style.backgroundColor = 'white';
    }, delay);
  }
});
