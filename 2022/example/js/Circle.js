export default class Circle {
  constructor(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (this.type == 1) {
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    } else {
      ctx.rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r);
    }
    ctx.fill();
    ctx.closePath();
  }
}
