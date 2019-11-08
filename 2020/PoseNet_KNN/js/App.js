'use strict';
class App {
  constructor() {
    this.saver = false;
    this.withKey = false;
    // chargement de la video
    this.video = document.getElementById('video');
    this.video.style.opacity = 0;
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.style.position = 'absolute';
    const rect = this.video.getBoundingClientRect();
    this.canvas.style.top = rect.y;
    this.canvas.style.left = rect.x;
    this.canvas.width = this.w = window.innerWidth;    // rect.width;
    this.canvas.height = this.h = window.innerHeight;  // rect.height;

    this.ctx = this.canvas.getContext('2d');
    const c = Math.floor(this.w / 10);
    const l = Math.floor(this.h / 10);

    this.grid = new Grid(c, l, this.ctx);
    this.keypoints = [];
    this.lerpFactor = 0.1;
    this.counter = 0;
    this.isSaved = false;

    this.result = document.getElementById('result');

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

  addListeners() {
    if (!this.withKey) {
      document.addEventListener('click', this.saveKNNModel.bind(this));
    }
    document.addEventListener('keydown', this.keyDown.bind(this));
  }

  saveKNNModel(e) {
    e.preventDefault();
    if (!this.isSaved) {
      console.log(
          this.knnClassifier.getNumLabels(), this.knnClassifier.getCount());
      this.knnClassifier.save('KNNClassier.json');
      this.isSaved = true;
    }
  }

  modelLoaded() {
    // this.classifier =
    //     this.featureExtractor.classification(this.video,
    //     this.ready.bind(this));
    // this.featureExtractor.numClasses = 3;



    if (this.saver) {
      this.addListeners();
      this.knnClassifier = ml5.KNNClassifier();
      if (!this.withKey) {
        setInterval(() => {
          this.storeDatas();
        }, 5000);
      }
    } else {
      // load KNN
      this.knnClassifier = ml5.KNNClassifier();
      this.knnClassifier.load('KNNClassier.json', this.onKNNLoaded.bind(this));
    }
    // Listen to new 'pose' events
    this.poseNet.on('pose', this.drawPoses.bind(this));
  }

  onKNNLoaded() {
    setTimeout(() => {
      this.classify();
    }, 1000);
  }

  classify() {
    // console.log('classify', this.poses);
    if (this.poses) {
      // Get the total number of labels from knnClassifier
      const numLabels = this.knnClassifier.getNumLabels();
      if (numLabels <= 0) {
        console.error('There is no examples in any label');
        return;
      }
      let pose = this.poses[0].pose;
      const poseArray =
          pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
      this.knnClassifier.classify(poseArray, 1, this.gotResults.bind(this));
    } else {
      this.classify();
    }
  }

  gotResults(err, result) {
    // Display any error
    if (err) {
      console.error(err);
    }

    if (result.confidencesByLabel) {
      console.log('confidence', result.confidencesByLabel);
      console.log('label', result.label, result);
      // const obj = {'Diane thouvenin': 'eleve1', 'Maya': 'eleve2', 'Bastien':
      // 'copine'}; const obj_array = Object.keys(obj);
      // // obj_array = ['Diane','Maya','Bastien'];
      // for (let i = 0; i < obj_array.length; i++) {
      //   const name = obj_array[i];
      //   const eleve = obj[name];
      // }

      const _array = Object.keys(result.confidencesByLabel);
      console.log(_array[result.label]);
      this.result.textContent = _array[result.label];
      // const confidences = result.confidencesByLabel;
      // // result.label is the label that has the highest confidence
      // if (result.label) {
      //   select('#result').html(result.label);
      //   select('#confidence').html(`${confidences[result.label] * 100} %`);
      // }
      //
      // select('#confidenceA').html(`${confidences['A'] ? confidences['A'] *
      // 100 : 0} %`); select('#confidenceB').html(`${confidences['B'] ?
      // confidences['B'] * 100 : 0} %`);
    }

    this.classify();
  }

  keyDown(e) {
    console.log(e);
    switch (e.key) {
      case 'a':
        this.storeDatas('A');
        break;
      case 'b':
        this.storeDatas('B');
        break;
      case 'c':
        this.storeDatas('C');
        break;
      case 'Enter':
        this.saveKNNModel(e);
        break;
    }
  }

  storeDatas(label = null) {
    console.log('store data', this.counter);
    const copy = label || this.counter;
    let pose = this.poses[0].pose;

    // ARRAY . MAP
    // const poseArray = [];
    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   const p = pose.keypoints[i];
    //   console.log(p);
    //   const nouveauTableau = [p.score, p.position.x, p.position.y];
    //   poseArray.push(nouveauTableau);
    // }


    const poseArray =
        pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);

    this.knnClassifier.addExample(poseArray, copy.toString());
    this.counter++;
    // console.log('store data', this.counter);
    // for (let j = 0; j < pose.keypoints.length; j++) {
    // }
  }

  drawPoses(results) {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.poses = results;
    this.drawKeypoints(results);
    // this.drawSkeleton(results);
    // this.grid.update(results);
    // this.grid.draw();
  }

  // A function to draw ellipses over the detected keypoints
  drawKeypoints(poses) {
    try {
      if (this.keypoints.length == 0) {
        this.keypoints = poses[0].pose.keypoints;
      }
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
            // smooth here
            this.keypoints[j].position.x = this.lerp(
                this.keypoints[j].position.x, keypoint.position.x,
                this.lerpFactor);
            this.keypoints[j].position.y = this.lerp(
                this.keypoints[j].position.y, keypoint.position.y,
                this.lerpFactor);

            this.ctx.fillStyle = 'rgb(255,0,0)';
            this.ctx.beginPath();
            this.ctx.arc(
                this.keypoints[j].position.x, this.keypoints[j].position.y, 10,
                0, Math.PI * 2, false);
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
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
  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
  }
}
window.onload = function() {
  new App();
}
