let newWidth = 0;
let newHeight = 0;
let ratio = 1;
let handpose = null;
let predictions = [];
function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  capture = createCapture(VIDEO);
  // P5 met un un petit temps pour charger le stream video
  // createCapture devrait être une promise, pour bloquer la lecture du code
  // mais ça n'est pas le cas, on doit palier à ça en mettant un petit timeout
  setTimeout(() => {
    console.log(capture.width, capture.height); // 640->480
    // Avec les vraies dimensions de la video on peut faire les calculs de redimensionnement
    // On obtiendra un ratio à appliquer à nos points de posehand, car ils sont calculés sur la video non resizée
    newWidth = windowWidth;
    ratio = newWidth / capture.width;
    newHeight = capture.height * ratio;
  }, 1000);

  // ml5
  handpose = ml5.handpose(capture, modelLoaded.bind(this));
}

function draw() {
  image(capture, 0, 0, newWidth, newHeight);
  const prediction = predictions[0];
  //si on a des prediction on met à jour les positions des points
  if (prediction) {
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage.
      circle(keypoint[0] * ratio, keypoint[1] * ratio, 10);
    }
  }
}

function modelLoaded() {
  handpose.on("predict", (results) => {
    predictions = results;
  });
}
