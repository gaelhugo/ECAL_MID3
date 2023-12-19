import Utils from "./Utils.js";
export default class AiTool {
  constructor() {
    this.OBJECT_TO_SEND = {
      data: [
        "task(m9fvd6dunh9y85f)",
        4,
        "a man with a tuxedo",
        "",
        [],
        null,
        null,
        null,
        null,
        null,
        "",
        "",
        20,
        "DPM++ 2M Karras",
        4,
        0,
        "original",
        1,
        1,
        7,
        1.5,
        0.75,
        null,
        512,
        512,
        1,
        "Just resize",
        "Whole picture",
        32,
        "Inpaint masked",
        "",
        "",
        "",
        [],
        false,
        [],
        "",
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
        "* `CFG Scale` should be 2 or lower.",
        true,
        true,
        "",
        "",
        true,
        50,
        true,
        1,
        0,
        false,
        4,
        0.5,
        "Linear",
        "None",
        "",
        128,
        8,
        ["left", "right", "up", "down"],
        1,
        0.05,
        128,
        4,
        "fill",
        ["left", "right", "up", "down"],
        false,
        false,
        "positive",
        "comma",
        0,
        false,
        false,
        "",
        "",
        64,
        "None",
        2,
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
        [
          {
            name: "",
            data: "",
            is_file: true,
          },
        ],
        "",
        "",
        "",
      ],
      event_data: null,
      fn_index: 697,
      session_hash: "fxro9qmq1at",
    };
    //update the session_hash with the right value
  }

  setHash(ash) {
    this.OBJECT_TO_SEND["session_hash"] = ash;
  }

  async postData(imageData, maskData, width, height, prompt) {
    // if (imageData != "") {
    const b64Img = Utils.getImageUrlWithResize(imageData, 1024, 1024);
    const b64Mask = Utils.getImageUrlWithResize(maskData, 1024, 1024);
    // set image
    this.OBJECT_TO_SEND.data[10] = b64Img;
    this.OBJECT_TO_SEND.data[11] = b64Mask;
    // this.OBJECT_TO_SEND.data[8] = "";
    // set prompt
    this.OBJECT_TO_SEND.data[2] = prompt;
    //   // set width
    //   this.OBJECT_TO_SEND.data[23] = parseInt(width);
    //   // set height
    //   this.OBJECT_TO_SEND.data[24] = parseInt(height);
    // } else {
    //   // set prompt
    //   this.OBJECT_TO_SEND.data[1] = prompt;
    //   // set width
    //   this.OBJECT_TO_SEND.data[9] = parseInt(width);
    //   // set height
    //   this.OBJECT_TO_SEND.data[10] = parseInt(height);
    // }

    return fetch("http://localhost:7860/run/predict/", {
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
