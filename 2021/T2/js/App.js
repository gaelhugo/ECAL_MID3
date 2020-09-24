class App {
  constructor() {
    this.video = document.getElementById("video");
    this.loadVideo();
    this.loadModel();
    this.loadSound();
  }

  loadSound() {
    this.sounds = Array.from(document.getElementsByClassName("audio"));
    console.log(this.sounds);
  }

  loadVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  }

  loadModel() {
    this.featureExtractor = ml5.featureExtractor(
      "MobileNet",
      this.modelLoaded.bind(this)
    );
  }

  modelLoaded() {
    console.log(this.featureExtractor);
    console.log("MOBILENET loaded");

    this.classifier = this.featureExtractor.classification(
      this.video,
      this.ready.bind(this)
    );
    this.featureExtractor.config.numLabels = 3;
  }

  ready() {
    console.log("CLASSIFIER VIERGE READY");
    this.initButtons();
  }
  initButtons() {
    this.interaction = document.addEventListener(
      "click",
      this.onClick.bind(this)
    );
    this.amaniteCounter = 0;
    this.chanterelleCounter = 0;
    this.rienCounter = 0;
    this.amaniteText = document.getElementById("amanite_counter");
    this.chanterelleText = document.getElementById("chanterelle_counter");
    this.rienText = document.getElementById("rien_counter");
  }
  onClick(e) {
    console.log(e.target.id);
    if (e.target.id == "train") {
      console.log("ça devrait entrainer");
      this.classifier.train((lossValue) => {
        if (lossValue) {
          console.log(lossValue);
        } else {
          console.log("Model entrainé");
          this.launchPrediction();
        }
      });
    } else {
      if (e.target.id == "amanite") {
        this.classifier.addImage("amanite");
        this.amaniteCounter++;
        this.amaniteText.textContent = this.amaniteCounter;
      }
      if (e.target.id == "chanterelle") {
        this.classifier.addImage("chanterelle");
        this.chanterelleCounter++;
        this.chanterelleText.textContent = this.chanterelleCounter;
      }
      if (e.target.id == "rien") {
        this.classifier.addImage("rien");
        this.rienCounter++;
        this.rienText.textContent = this.rienCounter;
      }
    }
  }

  launchPrediction() {
    setInterval(() => {
      this.classifier.classify((error, prediction) => {
        if (error) {
          console.log(error);
        } else {
          console.log(prediction[0].label);
          if (prediction[0].label == "amanite") {
            console.log("sound play");
            this.sounds[0].play();
          }
          if (prediction[0].label == "chanterelle") {
            console.log("sound play");
            this.sounds[1].play();
          }
        }
      });
    }, 200);
  }
}

window.onload = () => {
  new App();
};
