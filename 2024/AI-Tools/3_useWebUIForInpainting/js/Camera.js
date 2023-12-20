export default class Camera {
  constructor(canvas, video) {
    this.video = video;
    this.canvasElement = canvas;
    this.canvasCtx = canvas.getContext("2d");
    this.enableCam();
  }

  enableCam() {
    // getUsermedia parameters.
    const constraints = {
      video: {
        width: 1024,
        height: 1024,
      },
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.video.srcObject = stream;
      setTimeout(() => {
        this.video.play();
      }, 1000);
      this.video.addEventListener("loadeddata", this.showWebcam.bind(this));
    });
  }

  // get the prediction
  showWebcam() {
    // this.canvasElement.style.width = this.video.videoWidth;
    // this.canvasElement.style.height = this.video.videoHeight;
    // this.canvasElement.width = this.video.videoWidth;
    // this.canvasElement.height = this.video.videoHeight;

    this.canvasCtx.save();
    this.canvasCtx.scale(-1, 1); // Inverse l'image horizontalement
    this.canvasCtx.drawImage(
      this.video,
      -this.video.videoWidth,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
    this.canvasCtx.restore();
    this.canvasCtx.save();
    requestAnimationFrame(this.showWebcam.bind(this));
  }
}
