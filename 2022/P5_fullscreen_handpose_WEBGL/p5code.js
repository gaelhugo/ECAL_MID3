let newWidth = 0;
let newHeight = 0;
let ratio = 1;
let handpose = null;
let predictions = [];
let cells = [];
function setup() {
  pixelDensity(1);
  // createCanvas(windowWidth, windowHeight);
  // noStroke();
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

    //build cells
    for (let i = 0; i < 21; i++) {
      cells.push(new Cell(0, 0));
    }
    console.log(cells);
  }, 1000);

  // ml5
  handpose = ml5.handpose(
    capture,
    { flipHorizontal: true },
    modelLoaded.bind(this)
  );
}

function draw() {
  // clear();
  //   image(capture, 0, 0, newWidth, newHeight);
  const prediction = predictions[0];

  //si on a des prediction on met à jour les positions des points
  if (prediction) {
    predictions = prediction.landmarks;
    // for (let j = 0; j < prediction.landmarks.length; j += 1) {
    //   const keypoint = prediction.landmarks[j];
    //   //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage. (ratio)
    //   cells[j].lerp(keypoint[0] * ratio, keypoint[1] * ratio, 0, 0.1);
    // }
  }
  cells.forEach((item, index) => {
    if (predictions.length == 21)
      item.lerp(
        predictions[index][0] * ratio,
        predictions[index][1] * ratio,
        0,
        0.5
      );
    // item.draw();
    if (index == 8) {
      window.updateMouse({ x: item.x, y: item.y });
    }
  });

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

class Cell extends p5.Vector {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.radius = 10;
  }
  draw() {
    circle(this.x, this.y, this.radius);
  }
}
