import AiTool from "./AiTool.js";
import Camera from "./Camera.js";
export default class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas_video = document.getElementById("canvas_video");
    this.video_ctx = this.canvas_video.getContext("2d");
    this.video = document.getElementsByTagName("video")[0];

    this.ctx = this.canvas.getContext("2d");
    this.prompt = document.getElementById("prompt");
    this.button = document.getElementById("button");

    this.tool = new AiTool();
    this.tool.setHash("mwhinhnp2k");

    this.camera = new Camera(this.canvas_video, this.video);

    this.button.addEventListener("click", this.onClick.bind(this));
  }

  async onClick(e) {
    // check if prompt is not empty
    if (this.prompt.value.length > 0) {
      // send prompt to server
      //
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // get the image from the canvas_video

      const response = await this.tool.postData(
        this.video_ctx.getImageData(
          0,
          0,
          this.canvas_video.width,
          this.canvas_video.height
        ),
        512,
        512,
        this.prompt.value
      );
      console.log(response);

      const image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0, 512, 512);
      };
      image.src = `http://localhost:7860/file=${response.data[0][0].name}`;
    }
  }
}
