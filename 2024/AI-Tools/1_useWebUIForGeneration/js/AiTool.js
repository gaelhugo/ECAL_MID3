import Utils from "./Utils.js";
import Config from "./Config.js";
export default class AiTool {
  constructor() {
    this.OBJECT_TO_SEND = {
      data: [
        "task(8x7qnhn1jarezas)",
        "",
        "",
        [],
        20,
        "DPM++ 2M Karras",
        1,
        1,
        7,
        512,
        512,
        false,
        0.7,
        2,
        "Latent",
        0,
        0,
        0,
        "Use same checkpoint",
        "Use same sampler",
        "",
        "",
        [],
        "None",
        false,
        "",
        0.8,
        -1,
        false,
        -1,
        0,
        0,
        0,
        null,
        null,
        null,
        null,
        false,
        false,
        "positive",
        "comma",
        0,
        false,
        false,
        "",
        "Seed",
        "",
        [],
        "Nothing",
        "",
        [],
        "Nothing",
        "",
        [],
        true,
        false,
        false,
        false,
        0,
        false,
        null,
        null,
        false,
        null,
        null,
        false,
        null,
        null,
        false,
        50,
        [],
        "",
        "",
        "",
      ],
      event_data: null,
      fn_index: 314,
      session_hash: "e62ire42wyv",
    };
    //update the session_hash with the right value
  }

  setHash(ash) {
    this.OBJECT_TO_SEND["session_hash"] = ash;
  }

  async postData(imageData, width, height, prompt) {
    if (imageData != "") {
      const b64Img = Utils.getImageUrlWithResize(imageData, width, height);
      // set image
      this.OBJECT_TO_SEND.data[5] = b64Img;
      // set prompt
      this.OBJECT_TO_SEND.data[2] = prompt;
      // set width
      this.OBJECT_TO_SEND.data[23] = parseInt(width);
      // set height
      this.OBJECT_TO_SEND.data[24] = parseInt(height);
    } else {
      // set prompt
      this.OBJECT_TO_SEND.data[1] = prompt;
      // set width
      this.OBJECT_TO_SEND.data[9] = parseInt(width);
      // set height
      this.OBJECT_TO_SEND.data[10] = parseInt(height);
    }

    return fetch(`${Config.API}run/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.OBJECT_TO_SEND),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
