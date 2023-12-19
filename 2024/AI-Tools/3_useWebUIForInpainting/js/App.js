import AiTool from "./AiTool.js";
import Camera from "./Camera.js";
export default class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas_video = document.getElementById("canvas_video");
    this.overlay = document.getElementById("overlay");
    this.overlay_ctx = this.overlay.getContext("2d");
    this.overlay_ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.video_ctx = this.canvas_video.getContext("2d");

    this.video = document.getElementsByTagName("video")[0];

    this.ctx = this.canvas.getContext("2d");
    this.prompt = document.getElementById("prompt");
    this.button = document.getElementById("button");
    this.photo = document.getElementById("photo");

    this.tool = new AiTool();
    this.tool.setHash("fxro9qmq1at");

    this.camera = new Camera(this.canvas_video, this.video);

    this.photo.addEventListener("click", this.onTakePhoto.bind(this));
    this.button.addEventListener("click", this.onClick.bind(this));
  }

  onTakePhoto(e) {
    this.data = this.video_ctx.getImageData(
      0,
      0,
      this.canvas_video.width,
      this.canvas_video.height
    );
    this.ctx.putImageData(this.data, 0, 0);
    this.initInteraction();
  }

  initInteraction() {
    this.overlay.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.overlay.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.overlay.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.overlay.addEventListener("mouseout", this.onMouseOut.bind(this));
  }

  onMouseDown(e) {
    this.isDrawing = true;
  }
  onMouseMove(e) {
    if (this.isDrawing === true) {
      this.overlay_ctx.fillStyle = "white";
      this.overlay_ctx.beginPath();
      this.overlay_ctx.arc(e.clientX * 2, e.clientY * 2, 60, 0, 2 * Math.PI);
      this.overlay_ctx.fill();
    }
  }
  onMouseUp(e) {
    this.isDrawing = false;
  }
  onMouseOut(e) {
    this.isDrawing = false;
  }

  async onClick(e) {
    // check if prompt is not empty
    if (this.prompt.value.length > 0) {
      // send prompt to server
      //
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // get the image from the canvas_video

      const response = await this.tool.postData(
        this.ctx.getImageData(
          0,
          0,
          this.canvas_video.width,
          this.canvas_video.height
        ),
        this.overlay_ctx.getImageData(
          0,
          0,
          this.canvas_video.width,
          this.canvas_video.height
        ),
        1024,
        1024,
        this.prompt.value
      );
      this.overlay_ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
      try {
        const image = new Image();
        image.onload = () => {
          this.ctx.drawImage(image, 0, 0, 1024, 1024);
        };
        image.src = `http://localhost:7860/file=${response.data[0][0].name}`;
      } catch (e) {
        console.log(e);
      }
    }
  }
}
