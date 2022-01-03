class App {
  constructor() {
    this.video = document.createElement("video");
    this.video_wrapper = document.getElementById("video");
    this.video_wrapper.appendChild(this.video);
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.video_wrapper.appendChild(this.canvas);
    this.video.width = 1280;
    this.canvas.width = window.innerWidth;
    this.video.height = 720;
    this.canvas.height = window.innerHeight;
    this.frameCount = 0;
    this.circles = [];
    this.loadVideo();
    this.loadPoseNetModel();
    this.initMatter();
    this.initListeners();
  }
  onKeydown(e) {
    // console.log(e.key);
    switch (e.key) {
      case "Enter":
        this.clearAllElement = true;
        break;
    }
  }
  initListeners() {
    document.addEventListener("keydown", this.onKeydown.bind(this));
  }

  initMatter() {
    this.MATTER = {
      Engine: Matter.Engine,
      Render: Matter.Render,
      World: Matter.World,
      Bodies: Matter.Bodies,
      engine: Matter.Engine.create(),
    };
    //
    this.floor = new Ground();
    this.floor.groundLimit(this.MATTER);
  }

  loadVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { min: 320, ideal: 1280, max: 1280 },
            height: { min: 240, ideal: 720, max: 720 },
          },
        })
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
          this.videoIsReady = true;
        });
    }
  }

  loadPoseNetModel() {
    this.poseNet = ml5.poseNet(this.video, this.modelLoaded.bind(this));
  }
  modelLoaded() {
    console.log("model loaded");
    this.isReady = true;
    this.draw();
    this.poseNet.on("pose", (results) => {
      if (!this.person && results && results[0])
        this.person = new Person(results[0].pose.keypoints, this.MATTER);
      this.poses = results;
    });
  }

  rainBubbles() {
    if (this.isReady && this.frameCount % 12 == 0) {
      this.circles.push(
        new Circle(
          Math.random() * window.innerWidth,
          0,
          Math.random() * 25 + 10,
          null,
          this.MATTER
        )
      );
      this.frameCount = 0;
    }
  }
  drawBubbles() {
    // DRAW
    for (let i = 0; i < this.circles.length; i++) {
      const posXBall = this.circles[i].body.position.x;
      const posYBall = this.circles[i].body.position.y;
      const radius = this.circles[i].body.circleRadius;
      //   let colorBall = this.circles[i].c;
      //   if (posYBall > 50) {
      //     colorBall = "#F00000";
      //   }

      if (
        this.person &&
        Matter.Collision.collides(
          this.circles[i].body,
          this.person.boundaries[0].body
        )
      ) {
        // console.log("HEAD TOUCHED");
        this.circles[i].c = "red";
      }

      if (posYBall > window.innerHeight + 70) {
        let index = i;
        this.circles[i].removeFromWorld();
        this.circles.splice(index, 1);
      }
      this.circles[i].show(this.ctx);
    }
  }

  draw() {
    this.ctx.fillStyle = "lightgrey";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.video, 0, 0);

    this.rainBubbles();
    this.drawBubbles();
    //person
    if (this.person) {
      if (this.poses.length > 0) {
        this.person.update(this.poses[0].pose.keypoints);
      }
      /**
       * HERE YOU SHOW OR HIDE THE DEBUG
       */
      this.person.show(this.ctx);
    }
    this.MATTER.Engine.update(this.MATTER.engine);
    this.frameCount++;

    //
    if (this.clearAllElement) {
      this.circles.forEach((item, index) => {
        this.circles[index].removeFromWorld();
        this.circles.splice(index, 1);
      });
      this.circles = [];
      this.clearAllElement = false;
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  //   clearAll() {
  //     this.circles.forEach((item, index) => {
  //       this.circles[index].removeFromWorld();
  //       this.circles.splice(index, 1);
  //     });
  //   }
}

window.onload = () => {
  new App();
};
