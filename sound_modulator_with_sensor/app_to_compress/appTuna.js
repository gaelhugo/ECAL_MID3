'use strict';
let sensorVal;
let delay;
let chorus;
class SocketConnection {
  constructor() {
    this.IP = document.body.getAttribute('data-IP');

    this.init();
  };

  init() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    window.WebSocket ? this.initConnection() : alert('Change browser please');
  };

  initConnection() {
    console.log('initConnection');
    this.connection = new WebSocket('ws://' + this.IP + ':81/');
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
  };

  onOpen() {
    console.log('websocket connection ok');
  };

  onError(n) {
    console.log('!!', n);
  };

  onMessage(n) {
    try {
      let o = JSON.parse(n.data);
      // document.body.innerHTML += o.distance + '<br/>';
      sensorVal.textContent = o.luminosity;
      delay.delayTime = o.luminosity;
      chorus.feedback = parseInt(o.luminosity) / 1000;
      console.log(o);
    } catch (e) {
      console.log('Bad JSON format', e);
    }
  };
};

// function launch(n) {
//   new SocketConnection();
// };
//
// window.addEventListener('DOMContentLoaded', launch);

// class AppModulation {
//   draw() {
//     this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//     this.ctx.fillStyle = 'black';
//
//     requestAnimationFrame(this.draw.bind(this));
//   }
// }
//
// function myFunction() {
//   console.log('hi');
// }

function startAudio() {
  console.log('start audio');
  let tuna = new Tuna(audioContext);

  delay = new tuna.Delay({
    feedback: 0.45,
    delayTime: 170,
    wetLevel: 0.7,
    dryLevel: 1,
    cutoff: 5000,
    bypass: false,
  });

  chorus =
      new tuna.Chorus({rate: 4, feedback: 0.2, delay: 0.0045, bypass: false});

  source.connect(delay.input);
  delay.connect(chorus.input);
  chorus.connect(audioContext.destination);
  // delay.connect(audioContext.destination);
  // source.start(audioContext.currentTime);

  chorus.bypass = true;
  delay.bypass = true;
};


let AC = 'AudioContext' in window ?
    AudioContext :
    'webkitAudioContext' in window ? webkitAudioContext :
                                     document.write('Web Audio not supported');

let audioContext = new AC();

let source = audioContext.createBufferSource();
source.loop = true;


let xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://www.oskareriksson.se/shed/assets/gitarrkompet.' +
// format);
xhr.open('GET', 'http://159.89.26.253/test.mp3');

xhr.responseType = 'arraybuffer';
xhr.onload = function(e) {
  audioContext.decodeAudioData(e.target.response, function(b) {
    source.buffer = b;
  });
};
xhr.send(null);

function clickPlay() {
  console.log('play', source);

  source.start(audioContext.currentTime);
};

function clickChorus() {
  chorus.bypass = !chorus.bypass;
  console.log('chorus active ' + !chorus.bypass);
};

function clickDelay() {
  delay.bypass = !delay.bypass;
  console.log('delay active ' + !delay.bypass);
};

// function clickPlay() {
//   startAudio();
//   console.log('play');
//
// }


// Initialize the page.
window.onload = function() {
  //  let appModulation = new AppModulation();

  let chorusBtn = document.getElementById('chorusBtn');
  let delayBtn = document.getElementById('delayBtn');
  let playBtn = document.getElementById('playBtn');
  sensorVal = document.getElementById('sensorVal');

  chorusBtn.addEventListener('click', clickChorus, false);
  delayBtn.addEventListener('click', clickDelay, false);
  playBtn.addEventListener('touchend', clickPlay, false);
  // INIT ALL AUDIO PART
  startAudio();
  new SocketConnection();
};
