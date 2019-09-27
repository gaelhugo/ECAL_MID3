'use strict';
class App {
  constructor() {
    // chargement de la video
    this.video = document.getElementById('video');
    this.loadVideo();
    this.loadModel();

    // 3 legends
    this.legend_green = document.getElementById('legend_green');
    this.legend_purple = document.getElementById('legend_purple');
    this.legend_red = document.getElementById('legend_red');
    // 3 counter
    this.counter_green = 0;
    this.counter_purple = 0;
    this.counter_red = 0;
  }

  loadVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
          .then((function(stream) {
                  // this.video.src = window.URL.createObjectURL(stream);
                  this.video.srcObject = stream;
                  this.video.play();
                }).bind(this));
    }
  };

  loadModel() {
    this.featureExtractor =
        ml5.featureExtractor('MobileNet', this.modelLoaded.bind(this));
  }

  modelLoaded() {
    this.classifier =
        this.featureExtractor.classification(this.video, this.ready.bind(this));
    this.featureExtractor.numClasses = 3;
  }

  ready() {
    console.log('ALL OK');
    // init listener
    this.interaction = document.getElementById('interaction');
    this.interaction.addEventListener('click', this.onbuttonclick.bind(this));
  }
  onbuttonclick(e) {
    let val = e.target.id.split('_');
    console.log(val);
    if (val.length == 2) {
      // train
      this.classifier.train((lossValue) => {
        if (lossValue) {
          this.l = lossValue;
          this.legend_green.textContent = 'Loss : ' + this.l;
        } else {
          console.log('train finito');
          this.legend_green.textContent = 'Loss : ' + this.l;
          setInterval(() => {
            this.classifier.classify((error, result) => {
              if (error) {
                console.log(error);
              } else {
                this.legend_purple.style.fontSize = '50px';
                this.legend_purple.textContent = result;
              }
            });
          }, 200);
        }
      });


    } else if (val[0] != '') {
      // add image
      if (val[0] == 'green') {
        this.counter_green++;
        this.legend_green.textContent = this.counter_green + ' images';
      }
      if (val[0] == 'purple') {
        this.counter_purple++;
        this.legend_purple.textContent = this.counter_purple + ' images';
      }
      if (val[0] == 'red') {
        this.counter_red++;
        this.legend_red.textContent = this.counter_red + ' images';
      }
      this.classifier.addImage(val[0]);
    }
  }
}
window.onload = function() {
  new App();
}
