import AiTool from "./AiTool.js";
export default class App {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.prompt = document.getElementById("prompt");
    this.button = document.getElementById("button");

    this.tool = new AiTool();
    this.tool.setHash("e62ire42wyv");

    this.button.addEventListener("click", this.onClick.bind(this));
  }

  async onClick(e) {
    // check if prompt is not empty
    if (this.prompt.value.length > 0) {
      // send prompt to server
      //
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const response = await this.tool.postData(
        "",
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
