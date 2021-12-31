let newWidth = 0;
let newHeight = 0;
let ratio = 1;
let handpose = null;
let predictions = [];

//
const myHand = { points: [] };
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

  for (let i = 0; i < 21; i++) {
    myHand.points.push({ x: 0, y: 0, prev: null });
  }

  // ml5
  handpose = ml5.handpose(capture, modelLoaded.bind(this));
}

function draw() {
  image(capture, 0, 0, newWidth, newHeight);
  const prediction = predictions[0];
  if (prediction) {
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage.
      myHand.points[j].x = lerp(myHand.points[j].x, keypoint[0] * ratio, 0.35);
      myHand.points[j].y = lerp(myHand.points[j].y, keypoint[1] * ratio, 0.35);
    }
  }
  let radius = 10;
  // console.log(frameCount);
  myHand.points.forEach((point, index) => {
    if (index == 8) {
      radius = 20;

      if (point.prev) {
        if (frameCount % 5 == 0 && Math.abs(point.prev - point.x) > 50) {
          console.log("CHANGE DIRECTION");
          if (point.prev - point.x > 0) {
            console.log("<--");
          } else {
            console.log("-->");
          }
        }
      }
      point.prev = point.x;
    } else {
      radius = 10;
    }
    circle(point.x, point.y, radius);
  });
}

function modelLoaded() {
  handpose.on("predict", (results) => {
    predictions = results;
  });
}
