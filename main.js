import "./style.css";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FrontSide } from "three";

let HTMLLink = document.querySelector(".link-HTML");
let isZooming = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//--------------- CAMERA -----------------------------------//
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//ändrar perspektivet
camera.position.set(0, 25, 40);
renderer.render(scene, camera);
const zoomCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
zoomCamera.position.set(camera.position);
renderer.render(scene, zoomCamera);
scene.add(zoomCamera);

//--------------- CAMERA -----------------------------------//

const objectGroup = new THREE.Object3D();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
//golvet

const floorTexture = new THREE.TextureLoader();
const albedo = floorTexture.load(
  "assets/TexturesCom_Wood_PlanksOld4_2x2_1K_albedo.jpeg"
);
albedo.anisotropy = maxAnisotropy;
albedo.wrapS = THREE.RepeatWrapping;
albedo.wrapT = THREE.RepeatWrapping;
albedo.repeat.set(4, 4);
const ao = floorTexture.load(
  "assets/TexturesCom_Wood_PlanksOld4_2x2_1K_ao.png"
);
ao.anisotropy = maxAnisotropy;
ao.wrapS = THREE.RepeatWrapping;
ao.wrapT = THREE.RepeatWrapping;
ao.repeat.set(4, 4);
const height = floorTexture.load(
  "assets/TexturesCom_Wood_PlanksOld4_2x2_1K_height.png"
);
height.anisotropy = maxAnisotropy;
const normal = floorTexture.load(
  "assets/TexturesCom_Wood_PlanksOld4_2x2_1K_normal.png"
);
normal.anisotropy = maxAnisotropy;
normal.wrapS = THREE.RepeatWrapping;
normal.wrapT = THREE.RepeatWrapping;
normal.repeat.set(4, 4);
const roughness = floorTexture.load(
  "assets/TexturesCom_Wood_PlanksOld4_2x2_1K_roughness.png"
);
roughness.anisotropy = maxAnisotropy;
roughness.wrapS = THREE.RepeatWrapping;
roughness.wrapT = THREE.RepeatWrapping;
roughness.repeat.set(4, 4);

const floorMaterial = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: ao,
  displacementMap: height,
  displacementScale: 1,
  roughnessMap: roughness,
});
floorMaterial.roughness = 0.4;
floorMaterial.encoding = THREE.sRGBEncoding;

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
const roof = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200, 512, 512),
  roofMaterial
);

const allWallMaterial = new THREE.MeshStandardMaterial({
  bumpmap: concreteAlbedo,
  normalMap: concreteNormal,
  displacementMap: concreteHeight,
  displacementScale: 1.8,
  roughnessMap: concreteRoughness,
  aoMap: concreteAo,
});

roof.rotation.x = Math.PI / 2;
roof.position.y = 75;
roof.receiveShadow = true;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200, 1112, 1112),
  floorMaterial
);
floor.receiveShadow = true;
// floor.geometry.uv2 = floor.geometry.attributes.uv;
floor.rotation.x -= Math.PI / 2;
scene.add(floor);

//---------------TEXT-------------------------------------//

//---------------FORMER -----------------------------------//

const wallTexture = new THREE.TextureLoader().load(
  "assets/concrete3-albedo.png"
);
wallTexture.magFilter = THREE.NearestFilter;
wallTexture.roughness = 2;
const wallTexture2 = new THREE.TextureLoader().load(
  "assets/concrete3.normal.png"
);

const texture = new THREE.TextureLoader().load("assets/home.png");
texture.magFilter = THREE.NearestFilter;
const textureProject2 = new THREE.TextureLoader().load("assets/nativeJS.png");
textureProject2.magFilter = THREE.NearestFilter;
const viteProject = new THREE.TextureLoader().load("assets/vite.jpeg");

const informationBoardTexture2 = new THREE.TextureLoader().load(
  "assets/tek_HTML_CSS.png"
);

const informationBoardTexture1 = new THREE.TextureLoader().load(
  "assets/tek_JavaScript.png"
);
const informationBoardMaterial1 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture1,
});
const informationBoardMaterial2 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture2,
});
const informationBoardSize = new THREE.BoxGeometry(10, 10, 0.2, 50);
const informationBoardMaterial = new THREE.MeshStandardMaterial({
  color: 0xb9bf9f,
});
const informationBoard1 = new THREE.Mesh(
  informationBoardSize,
  informationBoardMaterial1
);
const informationBoard2 = new THREE.Mesh(
  informationBoardSize,
  informationBoardMaterial2
);
informationBoard1.lookAt(camera.position);
informationBoard1.position.y = 10;
informationBoard1.position.x = 50;
informationBoard1.position.z = -60;
informationBoard1.userData.name = "JavaScript";
informationBoard1.castShadow = true;
informationBoard1.scale.set(1, 1, 1);
informationBoard2.lookAt(camera.position);
informationBoard2.position.y = 10;
informationBoard2.castShadow = true;
informationBoard2.userData.name = "HTML";
informationBoard2.position.x = -20;
informationBoard2.position.z = -60;
scene.add(informationBoard1, informationBoard2);

const pillarSize = new THREE.CylinderGeometry(0.2, 0.2, 10, 10);
const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
const pillar1 = new THREE.Mesh(pillarSize, pillarMaterial);
const pillar2 = new THREE.Mesh(pillarSize, pillarMaterial);
pillar1.position.y = 5;
pillar1.userData.name = "JavaScript";
pillar1.castShadow = true;
pillar1.position.x = 50;
pillar1.position.z = -61;
pillar2.position.y = 5;
pillar2.userData.name = "HTML";
pillar2.castShadow = true;
pillar2.position.x = -20;
pillar2.position.z = -61;
scene.add(pillar1, pillar2);

//vilken form den har
const wallsize = new THREE.BoxGeometry(200, 150, 3, 400);
const sideWallSize = new THREE.BoxGeometry(3, 150, 200, 400);
const geometry = new THREE.BoxGeometry(50, 30, 2, 400);
const projectSideWall = new THREE.BoxGeometry(3, 60, 90, 400);
const wallmaterial = new THREE.MeshStandardMaterial({
  map: wallTexture,
});
const wallBack = new THREE.Mesh(wallsize, roofMaterial);
wallBack.receiveShadow = true;
const wallLeft = new THREE.Mesh(sideWallSize, roofMaterial);
const wallRight = new THREE.Mesh(sideWallSize, roofMaterial);
roofMaterial.color.set(0xf7f2eb);
roofMaterial.opacity = 0.3;
wallLeft.position.y = 25;
wallLeft.position.x = -100;
wallBack.position.y = 25;
wallRight.position.y = 25;
wallRight.position.x = 100;
wallBack.position.z = -100;
//wrapper runt objektet

const materialProject1 = new THREE.MeshBasicMaterial({
  map: texture,
  side: FrontSide,
});
const materialProject2 = new THREE.MeshBasicMaterial({
  map: textureProject2,
});
const materialProject3 = new THREE.MeshBasicMaterial({
  map: viteProject,
});

const project1 = new THREE.Mesh(geometry, materialProject1);
project1.position.x = -48;
project1.position.z = -96;
project1.position.y = 32;
project1.userData.name = "ProjHTML";
const project2 = new THREE.Mesh(geometry, materialProject2);
project2.position.x = 48;
project2.position.z = -96;
project2.position.y = 32;
project2.userData.name = "ProjJavaScript";

const project3 = new THREE.Mesh(projectSideWall, materialProject3);
project3.position.x = -96;
project3.position.y = 32;
project3.position.z = 0;
project3.userData.name = "ProjVue";

//hämtar det du vill ha till scenen
scene.add(project1, project2, wallBack, wallLeft, wallRight, project3);

//---------------FORMER -----------------------------------//

//---------------LJUS -------------------------------------//
//spotlight

const ambientLight = new THREE.AmbientLight(0xf5f1e7);
ambientLight.intensity = 1.5;

scene.add(ambientLight);

const spotlight1 = new THREE.SpotLight(0xffffff);
spotlight1.intensity = 0.5;
spotlight1.distance = 0;
spotlight1.decay = 2.4;
spotlight1.angle = 0.4;
spotlight1.penumbra = 1;
spotlight1.position.x = -9.86;
spotlight1.position.y = -3.5;
spotlight1.position.z = 18.81;
scene.add(spotlight1);

const spotlight2 = new THREE.SpotLight(0xffffff);
spotlight2.intensity = 0.4;
spotlight2.distance = 0;
spotlight2.decay = 2.4;
spotlight2.angle = 0.4;
spotlight2.penumbra = 1;
spotlight2.position.x = 19.91;
spotlight2.position.y = -9.86;
spotlight2.position.z = 49.69;
scene.add(spotlight2);

const pointLight = new THREE.PointLight(0xffffff);
const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.intensity = 0.6;
pointLight2.distance = 40;
pointLight2.decay = 0.2;
pointLight2.position.x = 50;
pointLight2.position.y = 37.56;
pointLight2.position.z = -35.22;
pointLight2.castShadow = true;
const pointLightHelper = new THREE.PointLightHelper(pointLight2);
pointLight.castShadow = true;
pointLight.intensity = 0.6;
pointLight.distance = 42.35;
pointLight.decay = 0.2;
pointLight.position.x = -18.68;
pointLight.position.y = 39.56;
pointLight.position.z = -35.22;
pointLight.castShadow = true;
scene.add(pointLight, pointLightHelper, pointLight2);
// const lightgui = new GUI();

// const pointLightFolder = lightgui.addFolder("THREE PointLight");
// pointLightFolder.add(pointLight2, "intensity", 0, 1, 0.01);
// pointLightFolder.add(pointLight2, "distance", 0, 100, 0.01);
// pointLightFolder.add(pointLight2, "decay", 0, 4, 0.1);
// pointLightFolder.add(pointLight2.position, "x", -50, 50, 0.01);
// pointLightFolder.add(pointLight2.position, "y", -50, 50, 0.01);
// pointLightFolder.add(pointLight2.position, "z", -50, 50, 0.01);
// pointLightFolder.open();

// const spotLightFolder = lightgui.addFolder("THREE.SpotLight");
// const spothelper = new THREE.SpotLightHelper(spotlight2);
// spotLightFolder.add(spotlight2, "distance", 0, 100, 0.01);
// spotLightFolder.add(spotlight2, "decay", 0, 4, 0.1);
// spotLightFolder.add(spotlight2, "angle", 0, 1, 0.1);
// spotLightFolder.add(spotlight2, "penumbra", 0, 1, 0.1);
// spotLightFolder.add(spotlight2.position, "x", -50, 50, 0.01);
// spotLightFolder.add(spotlight2.position, "y", -50, 50, 0.01);
// spotLightFolder.add(spotlight2.position, "z", -50, 50, 0.01);
// spotLightFolder.open();
// scene.add(spotlight1, spothelper);

//---------------LJUS -------------------------------------//

// låter dig å igenom rummet

// const p = intersects[0].point
// controls.target.set(p.x, p.y, p.z)

const controls = new PointerLockControls(camera, renderer.domElement);
const onKeyDown = function KeyboardEvent(event) {
  switch (event.code) {
    case "ArrowUp":
      controls.moveForward(1.62);
      break;
    case "ArrowRight":
      controls.moveRight(1.62);
      break;
    case "ArrowDown":
      controls.moveForward(-1.62);
      break;
    case "ArrowLeft":
      controls.moveRight(-1.62);
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);

//låter sig panorera över rummet
document.addEventListener("mousemove", function (e) {
  if (e.buttons === 1) {
    controls.lock();
  }
  false;
});

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 0, 10);
cameraFolder.open();

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

window.addEventListener("click", onMouseClick);
window.addEventListener("mousemove", onMouseHover);

function onMouseHover(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((object) => {
    if (
      object.object.userData.name === "HTML" ||
      object.object.userData.name === "JavaScript"
    ) {
      object.object.material.aoMapIntensity = 0;
    }
  });
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  let clickedObject = null;
  let intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((object) => {
    console.log(object.object.userData);
    if (object.object.userData.name === "JavaScript") {
      clickedObject = object;
      HTMLLink.setAttribute(
        "href",
        "https://github.com/ErikaAlexandersson/Native-JavaScript"
      );
      updateCamera(clickedObject);
    }
    if (object.object.userData.name === "HTML") {
      clickedObject = object;
      updateCamera(clickedObject);
    }
    if (object.object.userData.name === "ProjJavaScript") {
      clickedObject = object;
      // updateCamera(clickedObject);
      goToProject(clickedObject);
    }
  });
}

function goToProject(clickedObject) {
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: clickedObject.object.position.x,
        y: clickedObject.object.position.y,
        z: clickedObject.object.position.z + 30,
      },
      3000
    )
    // .easing(TWEEN.Easing.Cubic.In)
    .onUpdate(() => {
      camera.lookAt(
        clickedObject.object.position.x,
        clickedObject.object.position.y,
        clickedObject.object.position.z
      );
    })
    .onComplete(() => {
      textContainer.style.display = "block";
    })
    .start();
}

let backText = document.querySelector(".back");
let textContainer = document.querySelector(".text-container");
textContainer.style.display = "none";
backText.addEventListener("click", getBack);

function getBack() {
  isZooming = false;
  textContainer.style.display = "none";

  let cameraPosition = camera.position;
  console.log(cameraPosition);
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: cameraPosition.x,
        y: cameraPosition.y + 10,
        z: cameraPosition.z + 35,
      },
      1000
    )
    .onUpdate(() => {
      dimmUp();
      // camera.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    })
    .onComplete(() => {})
    .start();
}

function dimmUp() {
  const dimmer1 = new TWEEN.Tween(spotlight1)
    .to({ intensity: 0.6 }, 1000)
    .start();
  console.log(spotlight1.intensity);
  const dimmerPoint = new TWEEN.Tween(pointLight)
    .to({ intensity: 0.8 }, 1000)
    .start();
  const dimAmbientLight = new TWEEN.Tween(ambientLight)
    .to({ intensity: 1.5 }, 1000)
    .start();
}

function dimmLight() {
  const dimmer1 = new TWEEN.Tween(spotlight1)
    .to({ intensity: 0 }, 1000)
    .start();
  const dimmerPoint = new TWEEN.Tween(pointLight)
    .to({ intensity: 0 }, 1000)
    .start();
  const dimAmbientLight = new TWEEN.Tween(ambientLight)
    .to({ intensity: 0.8 }, 1000)
    .start();
}

function updateCamera(clickedObject) {
  isZooming = true;
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: clickedObject.object.position.x,
        y: clickedObject.object.position.y + 5,
        z: clickedObject.object.position.z + 10,
      },
      3000
    )
    // .easing(TWEEN.Easing.Cubic.In)
    .onUpdate(() => {
      camera.lookAt(
        clickedObject.object.position.x,
        clickedObject.object.position.y,
        clickedObject.object.position.z
      );
    })
    .onComplete(() => {
      scaleInformation(clickedObject);
      dimmLight();
    })
    .start();
}

function scaleInformation(clickedObject) {
  if ((isZooming = true)) {
    let tween = new TWEEN.Tween(clickedObject.object.scale)
      .to({ x: 2.3, y: 1.2, z: 0 }, 1000)
      .yoyo(true)
      .onComplete(() => {
        textContainer.style.display = "block";
        HTMLLink.className = "link-HTML-active";
      })
      .start();
  }
  if ((isZooming = false)) {
    let tween = new TWEEN.Tween(clickedObject.object.scale)
      .to({ x: 1, y: 1, z: 0 }, 1000)
      .yoyo(true)
      .onComplete(() => {
        textContainer.style.display = "block";
        HTMLLink.className = "link-HTML-active";
      })
      .start();
  }
}
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
  TWEEN.update();
}

function render() {
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
}

animate();
