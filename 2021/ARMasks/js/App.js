import * as THREE from "../node_modules/three/build/three.module.js";
import { OBJLoader } from "../node_modules/three/examples/jsm/loaders/OBJLoader.js";

//control par default pour la version non AR
// import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "../node_modules/three/examples/jsm/controls/FirstPersonControls.js";

import {
  color_materials,
  materialwhite,
  faces,
  ornements,
  lights,
} from "./Database.js";

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
    this.controls.handleResize();
  }

  async setup() {
    this.clock = new THREE.Clock();
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
      // this.camera = new THREE.PerspectiveCamera(
      //   70,
      //   window.innerWidth / window.innerHeight,
      //   1,
      //   10000
      // );
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      const c = new THREE.Color("rgba(220,220,255)"); // white
      const near = 50;
      const far = 500;
      this.scene.fog = new THREE.Fog(c, near, far);
    }

    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    // this.scene.add(light);
    lights.forEach((item) => {
      this.scene.add(item);
    });

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    //

    //NEW VERSION
    this.allfaces = [];
    const json = await this.loadjson("audio_files.json");
    const globalLoader = new OBJLoader();
    const audioLoader = new THREE.AudioLoader();
    json.forEach((item, index) => {
      if (index < (this.IS_AR ? 10 : 100)) {
        const name = item.split("/")[1].split(".ogg")[0];
        const param = name.split("_");
        const platform = param[0];
        const category = param[1];
        const age = param[2];
        let face = null;
        globalLoader.load(
          faces[age],
          (obj) => {
            face = obj;
            face.scale.multiplyScalar(1);
            obj.traverse((child) => {
              if (child.material) child.material = materialwhite;
            });
            const fact = 1 * (this.IS_AR ? 2 : 500);
            if (this.IS_AR) {
              face.scale.set(0.005, 0.005, 0.005);
              face.position
                .set(
                  fact / 2 - Math.random() * fact,
                  fact / 2 - Math.random() * fact,
                  fact / 2 - Math.random() * fact
                )
                .applyMatrix4(this.controller.matrixWorld);
            } else {
              // object.scale.set(0.25, 0.25, 0.25);
              face.position.set(
                fact / 2 - Math.random() * fact,
                fact / 2 - Math.random() * fact,
                fact / 2 - Math.random() * fact
              );
            }

            this.allfaces.push(face);
            this.scene.add(face);
          },
          //progress function
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          // just in case
          (error) => {
            console.log("An error happened", error);
          }
        );
        globalLoader.load(
          ornements[platform],
          (obj) => {
            obj.scale.multiplyScalar(1);
            obj.traverse((child) => {
              if (child.material) child.material = color_materials[category];
            });
            face.add(obj);
          },
          //progress function
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% ornement loaded");
          },
          // just in case
          (error) => {
            console.log("An error happened", error);
          }
        );
        const sound = new THREE.PositionalAudio(this.listener);
        const audioLimit = this.IS_AR ? 0.05 : 10;
        audioLoader.load(item, function (buffer) {
          sound.setBuffer(buffer);
          sound.setRefDistance(audioLimit);
          sound.setVolume(0.3);
          sound.loop = true;
          sound.play();
          face.add(sound);
        });
      }
    });

    if (this.IS_AR) {
      this.renderer.xr.enabled = true;
      this.controller = this.renderer.xr.getController(0);
      this.scene.add(this.controller);
    } else {
      // controls par défaut
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls = new FirstPersonControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.movementSpeed = 70;
      this.controls.lookSpeed = 0.05;
      this.controls.noFly = true;
      this.controls.lookVertical = true;
      this.controls.activeLook = true;

      // reculer un peu pour regarder la scène
      // this.camera.position.set(0, 0, 300);
      this.camera.position.set(0, 20, 0);
      //   si nécessaire regarder le centre
      //   this.camera.lookAt(0, 0, 0);
      this.draw();
    }
  }

  draw() {
    this.allfaces.forEach((face) => face.lookAt(this.camera.position));
    this.renderer.render(this.scene, this.camera);
    if (this.controls) {
      const delta = this.clock.getDelta();
      this.controls.update(delta);
      requestAnimationFrame(this.draw.bind(this));
    }
  }

  loadjson(url) {
    return fetch(url)
      .then((data) => data.json())
      .then((json) => json);
  }
}

window.onload = () => {
  new App();
};
