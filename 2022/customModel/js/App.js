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

const POSENET_POINTS = 17 * 2;

class App {
  constructor() {
    this.controllers = [];
    for (let i = 0; i < PARAMS.length; i++) {
      const param = PARAMS[i];
      const options = {
        min: param.range[0],
        max: param.range[1],
        step: 1,
        change: "input",
        param: param.name,
        callback: this.slide.bind(this),
      };
      const slider = new Slider(0, options, document.getElementById("sliders"));
      this.controllers.push(slider);
    }
    this.videoIsReady = false;
    document.addEventListener("click", this.onClick.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  modelReady() {
    console.log("model prêt");
    this.canPredict = true;
  }

  onKeyDown(e) {
    //enter
    if (e.keyCode == 13) {
      this.customNeuralNet.train(this.modelReady.bind(this));
    }
    //spacebbar
    if (e.keyCode == 32) {
      if (!this.modelIsTrained) {
        // get all values
        this.target = {};
        for (let i = 0; i < this.controllers.length; i++) {
          const slider = this.controllers[i].slider;
          this.target[i] = parseInt(slider.value);
        }
        setTimeout(() => {
          this.meshColor = "rgb(255,0,0,0.3)";
          this.recordData = true;
          // record data for 6 seconds
          setTimeout(() => {
            this.recordData = false;
            this.meshColor = "rgb(0,0,255,0.3)";
          }, 6000);
        }, 5000);
      }
    }
  }

  onClick(e) {
    console.log("click");
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
      this.loadPoseNetModel();
      this.meshColor = "rgb(0,0,255,0.3)";
      //neural net
      this.modelIsTrained = false;
      this.customNeuralNet = new NeuralNet(POSENET_POINTS, PARAMS.length);
    }
  }

  loadPoseNetModel() {
    this.poseNet = ml5.poseNet(this.video, this.modelLoaded.bind(this));
  }
  modelLoaded() {
    console.log("model loaded");

    this.poseNet.on("pose", (results) => {
      this.ctx.fillStyle = this.meshColor;
      const poses = results;
      if (poses.length > 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(poses);
        const keypoints = poses[0].pose.keypoints;
        const data = [];
        keypoints.forEach((point) => {
          const x = point.position.x;
          const y = point.position.y;
          data.push(x);
          data.push(y);
          this.ctx.beginPath();
          this.ctx.arc(x, y, 10, 0, Math.PI * 2, false);
          this.ctx.fill();
          this.ctx.closePath();
        });

        if (this.recordData) {
          this.customNeuralNet.addData(data, this.target);
        }
        if (this.canPredict) {
          this.customNeuralNet.predict(data, this.onPrediction.bind(this));
        }
      }
    });
  }

  onPrediction(error, result) {
    console.log("prediction en cours");

    /**
     *  IL MANQUE L'ACTION A EFFECTUER ICI
     */
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

  slide(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const param = e.target.getAttribute("data-param");
    const value = e.target.value;
    document.documentElement.style.setProperty(param, value);
  }
}

window.onload = () => {
  new App();
};
