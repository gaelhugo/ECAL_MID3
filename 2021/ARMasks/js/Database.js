import * as THREE from "../node_modules/three/build/three.module.js";

const path = "/reflection/";
const format = ".png";
const urls = [
  path + "px" + format,
  path + "nx" + format,
  path + "py" + format,
  path + "ny" + format,
  path + "pz" + format,
  path + "nz" + format,
];
const envMap = THREE.ImageUtils.loadTextureCube(
  urls,
  THREE.CubeReflectionMapping
);
const colors = {
  sexe: 0x5858ff,
  fake: 0x5affff,
  nude: 0x5fff5a,
  bully: 0xfbff5a,
  mental: 0xffb85a,
  money: 0xff5a5a,
  other: 0xea5aff,
};
export const color_materials = {};
Object.keys(colors).forEach((item) => {
  const material = new THREE.MeshPhongMaterial({
    color: colors[item],
    specular: 0xffffff,
    envMap: envMap,
    combine: THREE.MultiplyOperation,
    shininess: 50,
    reflectivity: 0.8,
  });
  color_materials[item] = material;
});
export const materialwhite = new THREE.MeshPhysicalMaterial({
  color: "white",
  metalness: 0.4,
  reflectivity: 1,
  side: THREE.DoubleSide,
  emissive: 1,
  roughness: 0,
  // TODO: Add custom blend mode that modulates background color by this materials color.
});

export const faces = {
  16: "/3d/lol.obj",
  18: "/3d/face.obj",
  25: "/3d/god.obj",
  30: "/3d/old.obj",
};

export const ornements = {
  facebook: "/3d/small/fb.obj",
  twitter: "/3d/small/twitter.obj",
  instagram: "/3d/small/insta.obj",
  tinder: "/3d/small/tinder.obj",
  other: "/3d/small/other.obj",
  tiktok: "/3d/small/tiktok.obj",
  grindr: "/3d/small/grindr.obj",
  snapchat: "/3d/small/snap.obj",
  forum: "/3d/small/forum.obj",
};

const ambientLight = new THREE.AmbientLight("white", 0.9);
ambientLight.name = "AmbientLight";
const dirLight = new THREE.DirectionalLight("white", 0.7);
dirLight.target.position.set(-50, 0, 0);
dirLight.add(dirLight.target);
dirLight.lookAt(0, 0, 0);
dirLight.name = "DirectionalLight";
const dirLight3 = new THREE.DirectionalLight("white", 1);
dirLight3.target.position.set(0, 0, 0);
dirLight3.add(dirLight.target);
dirLight3.lookAt(0, 0, 0);
dirLight3.name = "DirectionalLight";
const dirLight2 = new THREE.DirectionalLight("white", 0.7);
dirLight2.target.position.set(50, 0, 0);
dirLight2.add(dirLight2.target);
dirLight2.lookAt(0, 0, 0);
dirLight2.name = "DirectionalLight";
export const lights = [ambientLight, dirLight, dirLight3, dirLight2];
