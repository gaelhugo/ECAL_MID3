class Circle {
  constructor(x, y, r, group, MATTER) {
    this.MATTER = MATTER;
    let options = {
      friction: 0,
      restitution: 0.5,
    };

    if (group) options.collisionFilter = { group };

    this.body = this.MATTER.Bodies.circle(x, y, r, options);
    this.r = r;
    let colors = ["#FFFFFF", "#000000"];
    this.c = Math.random() < 0.5 ? colors[0] : colors[1];

    this.MATTER.World.add(this.MATTER.engine.world, this.body);
  }

  show(ctx) {
    // console.log("show");
    var pos = this.body.position;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  removeFromWorld() {
    this.MATTER.World.remove(this.MATTER.engine.world, this.body);
    // console.log("removed", this.MATTER.engine.world.bodies.length);
  }
}
