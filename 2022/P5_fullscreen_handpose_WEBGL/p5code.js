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
    // On obtiendra un ratio à appliquer à nos point de posehand, car ils sont calculés sur la video non resizée
    newWidth = windowWidth;
    ratio = newWidth / capture.width;
    newHeight = capture.height * ratio;
  }, 1000);

  // ml5
  handpose = ml5.handpose(capture, modelLoaded.bind(this));
}

function draw() {
  clear();
  //   image(capture, 0, 0, newWidth, newHeight);
  const prediction = predictions[0];

  //si on a des prediction on met à jour les positions des points
  if (prediction) {
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage. (ratio)
      circle(keypoint[0] * ratio, keypoint[1] * ratio, 10);

      /** EXEMPLE AVEC L'INDEX */
      if (j == 8)
        window.updateMouse({ x: keypoint[0] * ratio, y: keypoint[1] * ratio });
    }
  }
  //   appelle la fonction de rafraichissement du module
  if (typeof window.update == "function") window.update();
}

function modelLoaded() {
  console.log("modelLoaded");
  handpose.on("predict", (results) => {
    predictions = results;
  });
}

/**EXEMPLE AVEC LA SOURIS */
// function mouseMoved() {
//   //   console.log(mouseX, mouseY);
//   window.updateMouse({ x: mouseX, y: mouseY });
// }
