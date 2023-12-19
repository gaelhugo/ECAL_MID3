export default class Utils {
  constructor() {}

  static getImageUrlWithResize(imageData, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.putImageData(imageData, 0, 0);

    //  nouveau canvas avec la nouvelle dimension
    const resizeWidth = 1024;
    const resizeHeight = 1024; //height * (resizeWidth / width);
    const canvas2 = document.createElement("canvas");
    canvas2.width = resizeWidth;
    canvas2.height = Math.floor(resizeHeight);
    const ctx = canvas2.getContext("2d");
    ctx.drawImage(canvas, 0, 0, resizeWidth, resizeHeight);
    return canvas2.toDataURL();
  }
}
