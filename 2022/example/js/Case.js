export default class Case {
  constructor(x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.prevVal = null;
  }
  set state(table) {
    this.table = table;
  }

  draw(ctx) {
    ctx.fillStyle = `rgb(255,255,255)`;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "black";
    this.updateDependingOnState(ctx, this.id);
  }

  updateDependingOnState(ctx, id) {
    const i = Math.floor(id / 4);
    const j = id - i * 4;
    const val = this.table[i][j];

    if (val != 0) {
      const r = this.h / 3;

      ctx.beginPath();
      if (val == 1) {
        ctx.arc(
          this.x + this.w / 2,
          this.y + this.h / 2,
          r,
          0,
          Math.PI * 2,
          false
        );
      } else if (val == 2) {
        ctx.rect(
          this.x + this.w / 2 - r / 2,
          this.y + this.h / 2 - r / 2,
          r,
          r
        );
      }
      ctx.fill();
      ctx.closePath();
    }
  }
}
