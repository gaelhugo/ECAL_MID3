export default class Skeleton {
  constructor(ctx, PX = null) {
    this.ctx = ctx;
    this.timing = 0.3;

    this.scale = 0.25;
    this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (PX) {
      const textures = PIXI.Texture.from("./static/images/white_head.png");
      this.pixel = new PIXI.Texture(
        textures.baseTexture,
        new PIXI.Rectangle(7, 7, 1, 1)
      );
      this.head = new PIXI.Texture(
        textures.baseTexture,
        new PIXI.Rectangle(0, 0, 20, 20)
      );

      this.bodyPart = [];
      const color = Math.random() * 0xffffff;
      for (let i = 0; i < 8; i++) {
        const sprite = new PIXI.Sprite(this.pixel);
        sprite.tint = color;
        this.bodyPart.push(sprite);
        PX.stage.addChild(sprite);
      }
      const head = new PIXI.Sprite(this.head);
      head.tint = color;
      this.bodyPart.push(head);
      PX.stage.addChild(head);
    }
  }

  async initData(url) {
    /**
     * CHARGEMENT DES DATAS par personnage
     */
    this.frameCount = 0;
    this._data = await this.loadJSON(url);
    this.now = new Date().getTime();
    this.showNextPos();
  }

  showNextPos() {
    this.updateData(this._data.poses[this.frameCount].pose.keypoints);
    this.frameCount++;
    // option pour la boucle
    if (this.frameCount >= this._data.poses.length) {
      this.frameCount = 0;
      //on ajuste le delay de la première image
      // à voir si elle va continuer à exister
      this.now =
        new Date().getTime() - this._data.poses[this.frameCount].timestamp;
    }
  }

  loadJSON(url) {
    return fetch(url)
      .then((data) => data.json())
      .then((json) => json);
  }

  tick(time) {
    /**
     * update à la pose suivante si le timing est egal ou dépassé.
     */
    if (
      this.data &&
      time - this.now >= this._data.poses[this.frameCount].timestamp
    ) {
      this.showNextPos();
    }
  }
  updateData(data) {
    if (!this.data) {
      // init empty data
      this.data = [];
      for (let i = 0; i < data.length; i++) {
        this.data.push({ position: { x: 0, y: 0 } });
      }
      this.offset = {
        x: data[0].position.x * this.scale,
        y: data[0].position.y * this.scale,
      };
    } else {
      // DENOISE WITH LERP
      data.forEach((item, index) => {
        this.data[index].position.x = this.lerp(
          this.data[index].position.x,
          item.position.x,
          this.timing
        );
        this.data[index].position.y = this.lerp(
          this.data[index].position.y,
          item.position.y,
          this.timing
        );
      });
    }
  }

  drawPixi() {
    if (this.data) {
      //right arm
      const offsetX = -this.offset.x + this.position.x;
      const offsetY = -this.offset.y + this.position.y;
      const size = this.dist(this.data[6], this.data[8]);
      this.bodyPart[0].width = size;
      this.bodyPart[0].height = 9 * this.scale;
      this.bodyPart[0].anchor.set(0, 0.5);
      this.bodyPart[0].position.x =
        this.data[6].position.x * this.scale + offsetX;
      this.bodyPart[0].position.y =
        this.data[6].position.y * this.scale + offsetY;
      this.bodyPart[0].rotation = this.angle(this.data[6], this.data[8]);
      const size2 = this.dist(this.data[8], this.data[10]);
      this.bodyPart[1].width = size2;
      this.bodyPart[1].height = 5 * this.scale;
      this.bodyPart[1].anchor.set(0, 0.5);
      this.bodyPart[1].position.x =
        this.data[8].position.x * this.scale + offsetX;
      this.bodyPart[1].position.y =
        this.data[8].position.y * this.scale + offsetY;
      this.bodyPart[1].rotation = this.angle(this.data[8], this.data[10]);
      //left arm
      const size3 = this.dist(this.data[5], this.data[7]);
      this.bodyPart[2].width = size3;
      this.bodyPart[2].height = 9 * this.scale;
      this.bodyPart[2].anchor.set(0, 0.5);
      this.bodyPart[2].position.x =
        this.data[5].position.x * this.scale + offsetX;
      this.bodyPart[2].position.y =
        this.data[5].position.y * this.scale + offsetY;
      this.bodyPart[2].rotation = this.angle(this.data[5], this.data[7]);
      const size4 = this.dist(this.data[7], this.data[9]);
      this.bodyPart[3].width = size4;
      this.bodyPart[3].height = 5 * this.scale;
      this.bodyPart[3].anchor.set(0, 0.5);
      this.bodyPart[3].position.x =
        this.data[7].position.x * this.scale + offsetX;
      this.bodyPart[3].position.y =
        this.data[7].position.y * this.scale + offsetY;
      this.bodyPart[3].rotation = this.angle(this.data[7], this.data[9]);
      //right leg
      const size5 = this.dist(this.data[12], this.data[14]);
      this.bodyPart[4].width = size5;
      this.bodyPart[4].height = 9 * this.scale;
      this.bodyPart[4].anchor.set(0, 0.5);
      this.bodyPart[4].position.x =
        this.data[12].position.x * this.scale + offsetX;
      this.bodyPart[4].position.y =
        this.data[12].position.y * this.scale + offsetY;
      this.bodyPart[4].rotation = this.angle(this.data[12], this.data[14]);
      const size6 = this.dist(this.data[14], this.data[16]);
      this.bodyPart[5].width = size6;
      this.bodyPart[5].height = 5 * this.scale;
      this.bodyPart[5].anchor.set(0, 0.5);
      this.bodyPart[5].position.x =
        this.data[14].position.x * this.scale + offsetX;
      this.bodyPart[5].position.y =
        this.data[14].position.y * this.scale + offsetY;
      this.bodyPart[5].rotation = this.angle(this.data[14], this.data[16]);
      //left leg
      const size7 = this.dist(this.data[11], this.data[13]);
      this.bodyPart[6].width = size7;
      this.bodyPart[6].height = 9 * this.scale;
      this.bodyPart[6].anchor.set(0, 0.5);
      this.bodyPart[6].position.x =
        this.data[11].position.x * this.scale + offsetX;
      this.bodyPart[6].position.y =
        this.data[11].position.y * this.scale + offsetY;
      this.bodyPart[6].rotation = this.angle(this.data[11], this.data[13]);
      const size8 = this.dist(this.data[13], this.data[15]);
      this.bodyPart[7].width = size8;
      this.bodyPart[7].height = 5 * this.scale;
      this.bodyPart[7].anchor.set(0, 0.5);
      this.bodyPart[7].position.x =
        this.data[13].position.x * this.scale + offsetX;
      this.bodyPart[7].position.y =
        this.data[13].position.y * this.scale + offsetY;
      this.bodyPart[7].rotation = this.angle(this.data[13], this.data[15]);
      //head
      this.bodyPart[8].scale.set(this.scale);
      this.bodyPart[8].anchor.set(0.5, 0.5);
      this.bodyPart[8].position.x =
        this.data[0].position.x * this.scale + offsetX;
      this.bodyPart[8].position.y =
        this.data[0].position.y * this.scale + offsetY;
    }
  }

  draw() {
    if (this.data) {
      //body
      this.ctx.beginPath();
      this.ctx.moveTo(this.data[5].position.x, this.data[5].position.y);
      this.ctx.lineTo(this.data[6].position.x, this.data[6].position.y);
      this.ctx.lineTo(this.data[12].position.x, this.data[12].position.y);
      this.ctx.lineTo(this.data[11].position.x, this.data[11].position.y);
      this.ctx.lineTo(this.data[5].position.x, this.data[5].position.y);
      this.ctx.stroke();
      this.ctx.closePath();
      //right arms
      this.ctx.beginPath();
      this.ctx.moveTo(this.data[6].position.x, this.data[6].position.y);
      this.ctx.lineTo(this.data[8].position.x, this.data[8].position.y);
      this.ctx.lineTo(this.data[10].position.x, this.data[10].position.y);
      this.ctx.stroke();
      this.ctx.closePath();
      //left arms
      this.ctx.beginPath();
      this.ctx.moveTo(this.data[5].position.x, this.data[5].position.y);
      this.ctx.lineTo(this.data[7].position.x, this.data[7].position.y);
      this.ctx.lineTo(this.data[9].position.x, this.data[9].position.y);
      this.ctx.stroke();
      this.ctx.closePath();
      //right leg
      this.ctx.beginPath();
      this.ctx.moveTo(this.data[12].position.x, this.data[12].position.y);
      this.ctx.lineTo(this.data[14].position.x, this.data[14].position.y);
      this.ctx.lineTo(this.data[16].position.x, this.data[16].position.y);
      this.ctx.stroke();
      this.ctx.closePath();
      //left leg
      this.ctx.beginPath();
      this.ctx.moveTo(this.data[11].position.x, this.data[11].position.y);
      this.ctx.lineTo(this.data[13].position.x, this.data[13].position.y);
      this.ctx.lineTo(this.data[15].position.x, this.data[15].position.y);
      this.ctx.stroke();
      this.ctx.closePath();
      //head
      this.ctx.beginPath();
      this.ctx.arc(
        this.data[0].position.x,
        this.data[0].position.y,
        15,
        0,
        Math.PI * 2,
        false
      );
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }

  dist(p1, p2) {
    return Math.sqrt(
      Math.pow(p2.position.x * this.scale - p1.position.x * this.scale, 2) +
        Math.pow(p2.position.y * this.scale - p1.position.y * this.scale, 2)
    );
  }

  angle(p1, p2) {
    return Math.atan2(
      p2.position.y * this.scale - p1.position.y * this.scale,
      p2.position.x * this.scale - p1.position.x * this.scale
    );
  }
}
