'use strict';
class App {
  constructor() {
    // chargement de la video
    this.video = document.getElementById('video');
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.style.position = 'absolute';
    const rect = this.video.getBoundingClientRect();
    this.canvas.style.top = rect.y;
    this.canvas.style.left = rect.x;
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.ctx = this.canvas.getContext('2d');
    this.loadVideo();
    this.loadModel();

    // // 3 legends
    // this.legend_green = document.getElementById('legend_green');
    // this.legend_purple = document.getElementById('legend_purple');
    // this.legend_red = document.getElementById('legend_red');
    // // 3 counter
    // this.counter_green = 0;
    // this.counter_purple = 0;
    // this.counter_red = 0;
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
    // this.featureExtractor =
    //     ml5.featureExtractor('MobileNet', this.modelLoaded.bind(this));
    this.poseNet = ml5.poseNet(this.video, this.modelLoaded.bind(this));
  }

  modelLoaded() {
    // this.classifier =
    //     this.featureExtractor.classification(this.video,
    //     this.ready.bind(this));
    // this.featureExtractor.numClasses = 3;
    // Listen to new 'pose' events
    this.poseNet.on('pose', this.drawPoses.bind(this));
  }

  drawPoses(results) {
    console.log(results.length);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.drawKeypoints(results);
    this.drawSkeleton(results);
  }

  // A function to draw ellipses over the detected keypoints
  drawKeypoints(poses) {
    try {
      // Loop through all the poses detected
      for (let i = 0; i < 1; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
          // A keypoint is an object describing a body part (like rightArm or
          // leftShoulder)
          let keypoint = pose.keypoints[j];
          // Only draw an ellipse is the pose probability is bigger than 0.2
          if (keypoint.score > 0.2) {
            this.ctx.fillStyle = 'rgb(255,0,0)';
            this.ctx.beginPath();
            this.ctx.arc(
                keypoint.position.x, keypoint.position.y, 10, 0, Math.PI * 2,
                false);
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // A function to draw the skeletons
  drawSkeleton(poses) {
    try {
      // Loop through all the skeletons detected
      for (let i = 0; i < 1; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
          let partA = skeleton[j][0];
          let partB = skeleton[j][1];
          this.ctx.strokeStyle = 'rgb(255,0,0)';
          this.ctx.beginPath();
          this.ctx.moveTo(partA.position.x, partA.position.y);
          this.ctx.lineTo(partB.position.x, partB.position.y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }



  //
  // ready() {
  //   console.log('ALL OK');
  //   // init listener
  //   this.interaction = document.getElementById('interaction');
  //   this.interaction.addEventListener('click',
  //   this.onbuttonclick.bind(this));
  // }
  // onbuttonclick(e) {
  //   let val = e.target.id.split('_');
  //   console.log(val);
  //   if (val.length == 2) {
  //     // train
  //     this.classifier.train((lossValue) => {
  //       if (lossValue) {
  //         this.l = lossValue;
  //         this.legend_green.textContent = 'Loss : ' + this.l;
  //       } else {
  //         console.log('train finito');
  //         this.legend_green.textContent = 'Loss : ' + this.l;
  //         setInterval(() => {
  //           this.classifier.classify((error, result) => {
  //             if (error) {
  //               console.log(error);
  //             } else {
  //               this.legend_purple.style.fontSize = '50px';
  //               this.legend_purple.textContent = result;
  //             }
  //           });
  //         }, 200);
  //       }
  //     });
  //
  //
  //   } else if (val[0] != '') {
  //     // add image
  //     if (val[0] == 'green') {
  //       this.counter_green++;
  //       this.legend_green.textContent = this.counter_green + ' images';
  //     }
  //     if (val[0] == 'purple') {
  //       this.counter_purple++;
  //       this.legend_purple.textContent = this.counter_purple + ' images';
  //     }
  //     if (val[0] == 'red') {
  //       this.counter_red++;
  //       this.legend_red.textContent = this.counter_red + ' images';
  //     }
  //     this.classifier.addImage(val[0]);
  //   }
  // }
}
window.onload = function() {
  new App();
}
