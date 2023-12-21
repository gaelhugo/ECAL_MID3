import Camera from "./Camera";
import Config from "./Config";
export default class App {
  constructor() {
    this.video = document.getElementsByTagName("video")[0];
    this.canvas_video = document.getElementById("canvas_video");
    this.console = document.getElementById("console");
    this.prompt = document.getElementById("prompt");

    this.cam = new Camera(this.canvas_video, this.video);

    this.button = document.getElementById("button");
    this.button.addEventListener("click", this.getDescription.bind(this));
  }

  getDescription(e) {
    fetch(Config.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Config.API_KEY}`,
      },
      body: JSON.stringify({
        model: Config.MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: this.prompt.value },
              {
                type: "image_url",
                image_url: {
                  url: this.cam.getBase64(),
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    })
      .then((data) => data.json())
      .then((json) => {
        console.log(json);
        this.console.innerHTML = json.choices[0].message.content;
      });
  }
}
