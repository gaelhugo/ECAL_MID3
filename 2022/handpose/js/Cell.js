import Vectorjs from "@onemorestudio/vectorjs";
export default class Cell extends Vectorjs {
  constructor(x, y) {
    super();
    s;
    this.x = x;
    this.y = y;
    this.alpha = 1;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 1;
  }

  update() {
    if (this.alpha > 0) {
      this.alpha -= 0.1;
    } else {
      this.alpha = 0;
    }
  }
  draw(ctx) {
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}
