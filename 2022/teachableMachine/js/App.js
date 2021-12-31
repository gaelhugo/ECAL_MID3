"use strict";
class App {
  constructor() {
    this.loadVideo();
    this.loadModel();
  }

  loadVideo() {
    this.video = document.getElementsByTagName("video")[0];
    //controler que votre device a une camera dispo
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
    this.classifier = this.featureExtractor.classification(
      this.video,
      this.readyToClassify.bind(this)
    );
    this.featureExtractor.config.numLabels = 4;
  }

  readyToClassify() {
    console.log("ready to Classify");
    this.interaction = document.getElementById("interaction");
    this.interaction.addEventListener("touchstart", this.onClick.bind(this));
    this.counter_green = 0;
    this.counter_violet = 0;
    this.counter_red = 0;
    this.counter_orange = 0;

    // interaction pour charger un model pré-calculé

    this.loader = document.getElementById("loader");
    this.loader.addEventListener("change", this.onChange.bind(this));
  }

  onChange(e) {
    this.classifier.load(
      e.target.files[0].name,
      this.pleaseClassify.bind(this)
    );
  }

  onClick(e) {
    console.log(e);
    switch (e.target.id) {
      case "green":
        this.counter_green++;
        document.getElementById("green_count").textContent = this.counter_green;
        break;
      case "violet":
        this.counter_violet++;
        document.getElementById("violet_count").textContent =
          this.counter_violet;
        break;
      case "red":
        this.counter_red++;
        document.getElementById("red_count").textContent = this.counter_red;
        break;
      case "orange":
        this.counter_orange++;
        document.getElementById("orange_count").textContent =
          this.counter_orange;
        break;
      case "train":
        this.trainClassifier();
        break;
    }

    if (e.target.id != "train") this.classifier.addImage(e.target.id);
  }

  trainClassifier() {
    this.classifier.train((loss) => {
      if (loss) {
        document.getElementById("green_count").textContent = loss;
      } else {
        console.log("classifier READY");
        this.classifier.save();
        this.pleaseClassify();
      }
    });
  }

  pleaseClassify() {
    this.classifier.classify((error, result) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(result);
        document.getElementById("message").textContent = result[0].label;
      }
      this.pleaseClassify();
    });
  }
}

window.onload = () => {
  new App();
};
