import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
loader.load(
  // resource URL
  "assets/vr_staircase_art_gallery_2018/scene.gltf",
  // called when the resource is loaded
  function (gltf) {
    scene.add(gltf.scene);

    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

const ambientLight = new THREE.AmbientLight(0xf5f1e7);
ambientLight.intensity = 1.5;
ambientLight.castShadow = true;
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
// const loader = new GLTFLoader();
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// loader.load(
//   "assets/vr_staircase_art_gallery_2018/scene.gltf",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.log("error: ", error);
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// );

// const ambientLight = new THREE.AmbientLight(0xf5f1e7);
// ambientLight.intensity = 1.5;
// ambientLight.castShadow = true;
// scene.add(ambientLight);
// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector("#bg"),
// });

// const resize = () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// };

// export const createScene = (el) => {
//   renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
//   resize();
// };

// window.addEventListener("resize", resize);

const concreteAlbedo = roofTexture.load("assets/concrete_albedo.png");
concreteAlbedo.anisotropy = maxAnisotropy;
concreteAlbedo.wrapS = THREE.RepeatWrapping;
concreteAlbedo.wrapT = THREE.RepeatWrapping;
concreteAlbedo.repeat.set(4, 1);
const concreteAo = roofTexture.load("assets/concrete_ao.png");
concreteAo.anisotropy = maxAnisotropy;
concreteAo.wrapS = THREE.RepeatWrapping;
concreteAo.wrapT = THREE.RepeatWrapping;
concreteAo.opacity = 1.2;
concreteAo.repeat.set(4, 4);
const concreteHeight = roofTexture.load("assets/concrete_height.png");
concreteHeight.anisotropy = maxAnisotropy;
concreteHeight.wrapS = THREE.RepeatWrapping;
concreteHeight.wrapT = THREE.RepeatWrapping;
concreteHeight.repeat.set(4, 4);
const concreteNormal = roofTexture.load("assets/concrete_normal.png");
concreteNormal.anisotropy = maxAnisotropy;
concreteNormal.wrapS = THREE.RepeatWrapping;
concreteNormal.wrapT = THREE.RepeatWrapping;
concreteNormal.repeat.set(4, 4);
const concreteRoughness = roofTexture.load("assets/concrete_roughness.png");
concreteRoughness.anisotropy = maxAnisotropy;
concreteRoughness.wrapS = THREE.RepeatWrapping;
concreteRoughness.wrapT = THREE.RepeatWrapping;
concreteRoughness.repeat.set(4, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: concreteAlbedo,
  normalMap: concreteAlbedo,
  // displacementMap: concreteHeight,
  // displacementScale: 3,
  // roughnessMap: concreteRoughness,
  // aoMap: concreteAo,
});

const roofTexture = new THREE.TextureLoader();

const concreteAlbedo = roofTexture.load("assets/concrete_albedo.png");
concreteAlbedo.anisotropy = maxAnisotropy;
concreteAlbedo.wrapS = THREE.RepeatWrapping;
concreteAlbedo.wrapT = THREE.RepeatWrapping;
concreteAlbedo.repeat.set(4, 4);
const concreteAo = roofTexture.load("assets/concrete_ao.png");
concreteAo.anisotropy = maxAnisotropy;
concreteAo.wrapS = THREE.RepeatWrapping;
concreteAo.wrapT = THREE.RepeatWrapping;
concreteAo.opacity = 1.2;
concreteAo.repeat.set(4, 4);
const concreteHeight = roofTexture.load("assets/concrete_height.png");
concreteHeight.anisotropy = maxAnisotropy;
concreteHeight.wrapS = THREE.RepeatWrapping;
concreteHeight.wrapT = THREE.RepeatWrapping;
concreteHeight.repeat.set(4, 4);
const concreteNormal = roofTexture.load("assets/concrete_normal.png");
concreteNormal.anisotropy = maxAnisotropy;
concreteNormal.wrapS = THREE.RepeatWrapping;
concreteNormal.wrapT = THREE.RepeatWrapping;
concreteNormal.repeat.set(4, 4);
const concreteRoughness = roofTexture.load("assets/concrete_roughness.png");
concreteRoughness.anisotropy = maxAnisotropy;
concreteRoughness.wrapS = THREE.RepeatWrapping;
concreteRoughness.wrapT = THREE.RepeatWrapping;
concreteRoughness.repeat.set(4, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: concreteRoughness,
  normalMap: concreteNormal,
  displacementMap: concreteHeight,
  displacementScale: 1,
  roughnessMap: concreteRoughness,
  aoMap: concreteAlbedo,
});
