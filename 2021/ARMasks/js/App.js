import * as THREE from "../node_modules/three/build/three.module.js";
import { OBJLoader } from "../node_modules/three/examples/jsm/loaders/OBJLoader.js";

//control par default pour la version non AR
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

class App {
  constructor() {
    //   AR STUFF
    this.IS_AR = true;
    this.session = {};
    this.container = document.createElement("div");
    this.container.className = "container";
    document.body.appendChild(this.container);
    // on est obligé d'avoir une interaction utilisateur pour commencer en AR
    // (ACTIVATION DE LA CAM)
    this.handlers = {
      begin: this.onBegin.bind(this),
    };
    if (this.IS_AR) {
      document.addEventListener("click", this.handlers.begin);
    } else {
      // sinon on lance le truc standard
      this.setup();
    }
  }
  onBegin(e) {
    document.removeEventListener("click", this.handlers.begin);
    if (this.IS_AR) this.checkXR();
    this.setup();
  }

  checkXR() {
    if ("xr" in navigator) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((supported) => {
          supported ? this.initAR() : this.ARNotSupported();
        })
        .catch(() => {
          this.ARNotSupported();
        });
    } else {
      this.ARNotSupported();
    }
  }

  initAR() {
    console.log("init AR ");
    navigator.xr
      .requestSession("immersive-ar", this.session)
      .then((session) => {
        session.addEventListener("end", this.onSessionEnded.bind(this));
        this.renderer.xr.setReferenceSpaceType("local");
        this.renderer.xr.setSession(session);
        this.currentSession = session;
        this.renderer.setAnimationLoop(this.draw.bind(this));
      });
  }

  onSessionEnded() {
    alert("finito");
  }

  ARNotSupported() {
    alert("AR IS NOT SUPPORTED");
  }

  //   cette fonction n'est pas utilisée, mais il faudrait
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setup() {
    this.scene = new THREE.Scene();
    // pas forcément utile mais ça semble mieux marcher avec une caméra plus restreinte.
    if (this.IS_AR) {
      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
    } else {
      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
    }

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    this.scene.add(light);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.appendChild(this.renderer.domElement);
    //

    if (this.IS_AR) {
      this.renderer.xr.enabled = true;
      this.controller = this.renderer.xr.getController(0);
      this.scene.add(this.controller);
    } else {
      // controls par défaut
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // reculer un peu pour regarder la scène
      this.camera.position.set(0, 0, 300);
      //   si nécessaire regarder le centre
      //   this.camera.lookAt(0, 0, 0);
      this.draw();
    }

    this.allSphere = [];
    for (let i = 0; i < 50; i++) {
      const loader = new OBJLoader();
      loader.load(
        "mask1.obj",
        (object) => {
          // petite magouille pour activer le double side
          object.children.forEach((item) => {
            item.material.side = 2;
          });
          const fact = 1 * (this.IS_AR ? 2 : 500);
          if (this.IS_AR) {
            object.scale.set(0.001, 0.001, 0.001);
            object.position
              .set(
                fact / 2 - Math.random() * fact,
                fact / 2 - Math.random() * fact,
                fact / 2 - Math.random() * fact
              )
              .applyMatrix4(this.controller.matrixWorld);
          } else {
            object.scale.set(0.25, 0.25, 0.25);
            object.position.set(
              fact / 2 - Math.random() * fact,
              fact / 2 - Math.random() * fact,
              fact / 2 - Math.random() * fact
            );
          }
          this.scene.add(object);
          //juste pour tournet tous les visages vers le centre
          object.children[0].lookAt(0, 0, 0);
        },
        // progress function
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // just in case
        (error) => {
          console.log("An error happened", error);
        }
      );
    }
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
    if (this.controls) {
      this.controls.update();
      requestAnimationFrame(this.draw.bind(this));
    }
  }
}

window.onload = () => {
  new App();
};
