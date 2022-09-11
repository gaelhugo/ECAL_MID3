/**
CREATIVE CODING
---
Kill server : CTRL + C
Start server : npm run start
Start secure server : npm run start-https
Final build : npm run build
---
To generate new certificate for https connection with external device run :
#sh
mkcert 0.0.0.0 localhost 127.0.0.1 yourLocalIP ::1
mv 0.0.0.0+4-key.pem certificate.key
mv 0.0.0.0+4.pem certificate.cert
**/

import Playground from "@onemorestudio/playgroundjs";
import Cell from "./Cell";
export default class App extends Playground {
  constructor() {
    super();
    this.ctx.fillStyle = "black";
    this.loadVideo();
  }

  loadVideo() {
    this.video = document.getElementsByTagName("video")[0];
    //controler que votre device a une camera dispo
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
        this.start();
      });
    }
  }

  start() {
    this.predictions = [];
    // Create a new handpose method
    this.handpose = ml5.handpose(this.video, this.modelLoaded.bind(this));
  }

  modelLoaded() {
    console.log("Model Loaded!");
    // rapport windowWidth / videoWidth === > le facteur de modification des coord.
    // (ne pas oublier le device pixel ratio)
    this.ratio = window.innerWidth / this.video.getBoundingClientRect().width;
    this.view(
      this.video.getBoundingClientRect().width * this.ratio,
      this.video.getBoundingClientRect().height * this.ratio
    );
    this.video.width = window.innerWidth;
    this.cells = [];
    this.loadCells();
    this.predict();
    this.draw();
  }

  loadCells() {
    // les particules pour dessiner la main
    for (let i = 0; i < 21; i++) {
      this.cells.push(new Cell(this.width / 2, this.height / 2));
    }
  }
  predict() {
    this.handpose.on("predict", (results) => {
      this.predictions = results;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const prediction = this.predictions[0];
    //si on a des prediction on met à jour les positions des points
    if (prediction) {
      for (let j = 0; j < prediction.landmarks.length; j += 1) {
        const keypoint = prediction.landmarks[j];
        this.cells[j].lerp(
          keypoint[0] * this.ratio * window.devicePixelRatio,
          keypoint[1] * this.ratio * window.devicePixelRatio,
          0.5
        );
      }
    }
    //on dessine les points dans tous les cas
    this.cells.forEach((item) => {
      item.draw(this.ctx);
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}
