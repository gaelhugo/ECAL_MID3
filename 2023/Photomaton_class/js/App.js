import Slider from "./Slider.js";
import NeuralNet from "./NeuralNet.js";

const PARAMS = [
  { name: "--custom-WMX2", range: [0, 1000] },
  { name: "--custom-TRMG", range: [0, 1000] },
  { name: "--custom-BLDA", range: [0, 1000] },
  { name: "--custom-TRMD", range: [0, 1000] },
  { name: "--custom-TRMC", range: [0, 1000] },
  { name: "--custom-SKLD", range: [0, 1000] },
  { name: "--custom-TRML", range: [0, 1000] },
  { name: "--custom-SKLA", range: [0, 1000] },
  { name: "--custom-TRMF", range: [0, 1000] },
  { name: "--custom-TRMK", range: [0, 1000] },
  { name: "--custom-BLDB", range: [0, 1000] },
  { name: "--custom-TRMB", range: [0, 1000] },
  { name: "--custom-TRMA", range: [0, 1000] },
  { name: "--custom-SKLB", range: [0, 1000] },
  { name: "--custom-TRME", range: [0, 1000] },
];

const MESH_POINTS = 468 * 3;

class App {
  constructor() {
    this.handlers = {
      keydown: this.onkeydown.bind(this),
      click: this.presetWithFaceMesh.bind(this),
      slide: this.onSlide.bind(this),
      modelReady: this.modelReady.bind(this),
      onPrediction: this.gotPrediction.bind(this),
    };

    this.controllers = [];
    // SLIDERS INITIALISATION
    // for (const param of PARAMS) {
    for (let i = 0; i < PARAMS.length; i++) {
      const param = PARAMS[i];

      const options = {
        min: param.range[0],
        max: param.range[1],
        step: 1,
        change: "input",
        param: param.name,
        callback: this.handlers.slide,
      };
      const slider = new Slider(0, options, document.getElementById("sliders"));
      this.controllers.push(slider);
    }

    this.videoIsReady = false;
    this.meshColor = "rgb(0,0,255,0.3)";
    document.addEventListener("click", this.handlers.click);
    document.addEventListener("keydown", this.handlers.keydown);
  }

  onkeydown(e) {
    if (e.keyCode == 13) {
      this.customNeuraNet.train(this.handlers.modelReady);
    }

    if (e.keyCode == 32) {
      console.log("space bar");
      if (!this.modelIsTrained) {
        console.log("go add data");
        this.target = {};
        for (let i = 0; i < this.controllers.length; i++) {
          const slider = this.controllers[i].slider;
          this.target[i] = parseInt(slider.value);
        }
        this.meshColor = "rgb(255,0,0,0.3)";
        this.recordMeshData = true;
        setTimeout(() => {
          this.recordMeshData = false;
          this.meshColor = "rgb(0,0,255,0.3)";
        }, 6000);
      }
    }

    if (e.keyCode == 83) {
      this.customNeuraNet.saveModel();
    }

    if (e.keyCode == 76) {
      this.customNeuraNet.loadModel(this.handlers.modelReady);
    }
  }

  presetWithFaceMesh() {
    /*
    INIT CAMERA 
    */
    if (!this.videoIsReady) {
      this.video = document.createElement("video");
      this.video_wrapper = document.getElementById("video");
      this.video_wrapper.appendChild(this.video);
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.video_wrapper.appendChild(this.canvas);
      this.video.width = this.canvas.width = 640;
      this.video.height = this.canvas.height = 480;
      this.loadVideo();
      this.loadFaceMeshModel();
      //neural net
      this.modelIsTrained = false;
      this.customNeuraNet = new NeuralNet(MESH_POINTS, PARAMS.length);
      // this.customNeuraNet.loadModel(this.handlers.modelReady);
    }
  }

  loadVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        // this.video.src = window.URL.createObjectURL(stream);
        this.video.srcObject = stream;
        this.video.play();
        this.videoIsReady = true;
      });
    }
  }

  loadFaceMeshModel() {
    this.facemesh = ml5.facemesh(
      this.video,
      this.faceMeshModelReady.bind(this)
    );
  }

  faceMeshModelReady() {
    console.log("MODEL READY");
    this.facemesh.on("predict", (results) => {
      // console.log(results);
      this.predictions = results;
      this.ctx.clearRect(0, 0, 640, 480);
      if (this.predictions[0]) {
        const data = this.predictions[0].scaledMesh.flat(1);
        if (this.recordMeshData) {
          this.customNeuraNet.addData(data, this.target);
        }

        if (this.canPredict) {
          this.customNeuraNet.predict(data, this.handlers.onPrediction);
        }

        this.ctx.fillStyle = this.meshColor;
        this.predictions[0].scaledMesh.forEach((item, index) => {
          this.ctx.beginPath();
          this.ctx.arc(item[0], item[1], 2, 0, Math.PI * 2, false);
          this.ctx.fill();
          this.ctx.closePath();
        });
      }
    });
  }

  onSlide(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const param = e.target.getAttribute("data-param");
    const value = e.target.value;
    document.documentElement.style.setProperty(param, value);
  }

  modelReady(e) {
    this.modelIsTrained = true;
    this.canPredict = true;

    this.meshColor = "rgb(0,255,0,0.3)";

    //  this.customNeuraNet.saveModel();
    console.log("MODEL READY");
    this.video.style.opacity = 0.1;
    document.getElementById("sliders").style.opacity = 0.1;
  }

  gotPrediction(error, result) {
    for (let i = 0; i < result.length; i++) {
      const value = result[i].value;
      const slider = this.controllers[i].slider;
      slider.value = value;
      const param = slider.getAttribute("data-param");
      document.documentElement.style.setProperty(param, value);
    }
  }
}

window.onload = () => {
  new App();
};
