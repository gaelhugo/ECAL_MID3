import Skeleton from "./Skeleton.js";
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = window.innerWidth;
    this.canvas.height = this.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.initPixi();
    this.init();

    this.draw();
  }

  initPixi() {
    this.PX = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: false,
      antialias: true,
    });
    document.body.appendChild(this.PX.view);
  }

  async init() {
    /**
     *  !!! IMPORTANT A LIRE
     *  cet example charge 1000 x le même JSON
     *  évidemment le but étant d'avoir des JSON differents
     *  l'idée est d'avoir un syteme permettant de jouer des sequences differentes
     *  il faut optimiser le JSON initial, car il est beaucoup trop lourd
     * (le temps de chargement pour 1000 x 2.7 M se voit clairement à l'affichage)
     */
    this.allSkeletons = [];
    for (let i = 0; i < 1000; i++) {
      const sk = new Skeleton(this.ctx, this.PX);
      sk.position.x = Math.random() * this.width;
      sk.position.y = Math.random() * this.height;
      sk.initData("./static/json/fly.json");
      this.allSkeletons.push(sk);
    }
    this.skeleton = new Skeleton(this.ctx);
    this.skeleton.initData("./static/json/fly.json");
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const now = new Date().getTime();
    this.skeleton.tick(now);
    this.skeleton.draw();
    this.allSkeletons.forEach((item) => {
      item.tick(now);
      item.drawPixi();
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  new App();
};
