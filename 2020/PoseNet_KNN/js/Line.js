class Line {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.width = 0.5;
    this.height = 40;
    this.ctx = ctx;
    this.angle = 45;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(this.x, this.y, 4, 4);
  }
}
