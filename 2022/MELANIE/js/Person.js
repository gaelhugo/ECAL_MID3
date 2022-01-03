class Person {
  constructor(data, MATTER) {
    this.MATTER = MATTER;
    this.GROUP = Matter.Body.nextGroup(false);
    this.boundaries = [];
    this.points = [];
    this.lerpTiming = 0.5;
    this.defaultSize = 150;
    this.HEAD_SIZE = 250;
    //
    /**
     * LA TETE EST JUSTE LA POSITION DU NEZ EN PLUS GRAND
     */
    const shouldersDist = this.dist(data[1], data[2]);
    const ratio = this.map(shouldersDist, 0, 1280, 0, 1.5);

    data.forEach((item, index) => {
      this.points.push({ x: item.position.x, y: item.position.y });

      this.boundaries.push(
        new Boundary(
          item.position.x,
          item.position.y,
          index > 4
            ? this.defaultSize * ratio
            : index == 0
            ? this.HEAD_SIZE * ratio
            : 1,
          this.GROUP,
          MATTER,
          ratio
        )
      );
    });

    const parts = 200;
    // GET BODY PARTS
    this.armRight1 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.armRight2 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.armLeft1 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.armLeft2 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.legRight1 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.legRight2 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.legLeft1 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
    this.legLeft2 = new BodyPart(0, 0, parts, 40, this.GROUP, MATTER);
  }
  update(data) {
    data.forEach((item, index) => {
      this.points[index].x = this.lerp(
        this.points[index].x,
        item.position.x,
        this.lerpTiming
      );
      this.points[index].y = this.lerp(
        this.points[index].y,
        item.position.y,
        this.lerpTiming
      );
    });
    const shouldersDist = this.dist(data[1], data[2]);
    const ratio = this.map(shouldersDist, 0, 1280, 0, 8);

    this.boundaries.forEach((item, index) => {
      const transformation =
        (ratio * (index == 0 ? this.HEAD_SIZE : this.defaultSize)) /
        item.body.circleRadius;
      Matter.Body.setPosition(item.body, {
        x: this.points[index].x,
        y: this.points[index].y - (index == 0 ? 50 * ratio : 0),
      });
      Matter.Body.scale(
        item.body,
        index > 4 || index == 0 ? transformation : 1,
        index > 4 || index == 0 ? transformation : 1
      );
    });

    /////////////////////

    // ARMRIGHT
    const size = this.dist(data[6], data[8]);
    const angle = this.getAngle(data[6], data[8]);
    this.armRight1.position(data[6].position.x, data[6].position.y);
    this.armRight1.resize(size);
    this.armRight1.rotate(angle);
    const size2 = this.dist(data[8], data[10]);
    const angle2 = this.getAngle(data[8], data[10]);
    this.armRight2.position(data[8].position.x, data[8].position.y);
    this.armRight2.resize(size2);
    this.armRight2.rotate(angle2);

    // ARMLEFT
    const size3 = this.dist(data[5], data[7]);
    const angle3 = this.getAngle(data[5], data[7]);
    this.armLeft1.position(data[5].position.x, data[5].position.y);
    this.armLeft1.resize(size3);
    this.armLeft1.rotate(angle3);
    const size4 = this.dist(data[7], data[9]);
    const angle4 = this.getAngle(data[7], data[9]);
    this.armLeft2.position(data[7].position.x, data[7].position.y);
    this.armLeft2.resize(size4);
    this.armLeft2.rotate(angle4);

    // LEGRIGHT
    const size5 = this.dist(data[12], data[14]);
    const angle5 = this.getAngle(data[12], data[14]);
    this.legRight1.position(data[12].position.x, data[12].position.y);
    this.legRight1.resize(size5);
    this.legRight1.rotate(angle5);
    const size6 = this.dist(data[14], data[16]);
    const angle6 = this.getAngle(data[14], data[16]);
    this.legRight2.position(data[14].position.x, data[14].position.y);
    this.legRight2.resize(size6);
    this.legRight2.rotate(angle6);

    // LEGLEFT
    const size7 = this.dist(data[11], data[13]);
    const angle7 = this.getAngle(data[11], data[13]);
    this.legLeft1.position(data[11].position.x, data[11].position.y);
    this.legLeft1.resize(size7);
    this.legLeft1.rotate(angle7);
    const size8 = this.dist(data[13], data[15]);
    const angle8 = this.getAngle(data[13], data[15]);
    this.legLeft2.position(data[13].position.x, data[13].position.y);
    this.legLeft2.resize(size8);
    this.legLeft2.rotate(angle8);
  }

  show(ctx) {
    this.boundaries.forEach((item) => {
      item.show(ctx);
    });

    this.armRight1.show(ctx);
    this.armRight2.show(ctx);
    this.armLeft1.show(ctx);
    this.armLeft2.show(ctx);
    this.legRight1.show(ctx);
    this.legRight2.show(ctx);
    this.legLeft1.show(ctx);
    this.legLeft2.show(ctx);
  }

  lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }
  dist(p1, p2) {
    return Math.sqrt(
      Math.pow(p2.position.x - p1.position.x, 2) +
        Math.pow(p2.position.y - p1.position.y, 2)
    );
  }
  map(num, start1, stop1, start2, stop2) {
    return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }
  getAngle(p1, p2) {
    return Math.atan2(
      p2.position.y - p1.position.y,
      p2.position.x - p1.position.x
    );
  }
}
