import "./style.css";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";
import { FrontSide } from "three";

let HTMLLink = document.querySelector(".link-HTML");
let isZooming = false;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
concreteAo.opacity = 4;
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

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300, 1112, 1112),
  floorMaterial
);
floor.receiveShadow = true;
// floor.geometry.uv2 = floor.geometry.attributes.uv;
floor.rotation.x -= Math.PI / 2;
scene.add(floor);

//---------------TEXT-------------------------------------//

//---------------FORMER -----------------------------------//

const roofBoards = new THREE.TextureLoader();
const roofAlbedo = roofBoards.load("assets/WOODOSB_albedo.png");
roofAlbedo.anisotropy = maxAnisotropy;
roofAlbedo.wrapS = THREE.RepeatWrapping;
roofAlbedo.wrapT = THREE.RepeatWrapping;
const roofAO = roofBoards.load("assets/WOODOSB_ao.png");
roofAO.anisotropy = maxAnisotropy;
roofAO.wrapS = THREE.RepeatWrapping;
roofAO.wrapT = THREE.RepeatWrapping;
const roofHeight = roofBoards.load("assets/WOODOSB_height.png");
roofHeight.anisotropy = maxAnisotropy;
roofHeight.wrapS = THREE.RepeatWrapping;
roofHeight.wrapT = THREE.RepeatWrapping;
const roofNormal = roofBoards.load("assets/WOODOSB_normal.png");
roofNormal.anisotropy = maxAnisotropy;
roofNormal.wrapS = THREE.RepeatWrapping;
roofNormal.wrapT = THREE.RepeatWrapping;
const roofRoughness = roofBoards.load("assets/WOODOSB_roughness.png");
roofRoughness.anisotropy = maxAnisotropy;
roofRoughness.wrapS = THREE.RepeatWrapping;
roofRoughness.wrapT = THREE.RepeatWrapping;

const roofWoodMaterial = new THREE.MeshStandardMaterial({
  map: roofAO,
  normalMap: roofNormal,
  displacementMap: roofHeight,
  displacementScale: 3,
  roughnessMap: roofRoughness,
  aoMap: roofAO,
});

const roof = new THREE.Mesh(
  new THREE.BoxGeometry(200, 200, 0.2, 50),
  roofWoodMaterial
);
roof.receiveShadow = true;
// floor.geometry.uv2 = floor.geometry.attributes.uv;
roof.position.y = 90;
roof.rotation.x -= Math.PI / 2;

scene.add(roof);
const pillarSize = new THREE.CylinderGeometry(0.2, 0.2, 10, 10);
const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
const pillar1 = new THREE.Mesh(pillarSize, pillarMaterial);
const pillar2 = new THREE.Mesh(pillarSize, pillarMaterial);
const pillar3 = new THREE.Mesh(pillarSize, pillarMaterial);
const pillar4 = new THREE.Mesh(pillarSize, pillarMaterial);
pillar1.position.y = 5;
pillar1.userData.name = "JavaScript";
pillar1.castShadow = true;
pillar1.position.x = 50;
pillar1.position.z = -61;
pillar2.position.y = 5;
pillar2.userData.name = "HTML";
pillar2.castShadow = true;
pillar2.position.x = -37;
pillar2.position.z = -61;
pillar3.position.z = -20;
pillar3.position.y = 5;
pillar3.position.x = -56;
pillar4.position.z = -20;
pillar4.position.y = 5;
pillar4.position.x = 56;
scene.add(pillar1, pillar2, pillar3, pillar4);

const wallTexture = new THREE.TextureLoader().load(
  "assets/concrete3-albedo.png"
);
wallTexture.magFilter = THREE.NearestFilter;
wallTexture.roughness = 1;
const wallTexture2 = new THREE.TextureLoader().load(
  "assets/concrete3.normal.png"
);

const texture = new THREE.TextureLoader().load("assets/home.png");
texture.magFilter = THREE.NearestFilter;
const textureProject2 = new THREE.TextureLoader().load("assets/nativeJS.png");
textureProject2.magFilter = THREE.NearestFilter;
const viteProject = new THREE.TextureLoader().load("assets/vite.jpeg");
const crumbleProject = new THREE.TextureLoader().load("assets/crumble.png");

const informationBoardTexture2 = new THREE.TextureLoader().load(
  "assets/tek_HTML_CSS.png"
);

const informationBoardTexture1 = new THREE.TextureLoader().load(
  "assets/tek_JavaScript.png"
);
const informationBoardTexture3 = new THREE.TextureLoader().load(
  "assets/TekniskInformationVue3.png"
);
const informationBoardTexture4 = new THREE.TextureLoader().load(
  "assets/TekniskInformationCrumble.png"
);
const informationBoardMaterial1 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture1,
});
const informationBoardMaterial2 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture2,
});
const informationBoardMaterial3 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture3,
});
const informationBoardMaterial4 = new THREE.MeshBasicMaterial({
  map: informationBoardTexture4,
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

const informationBoard3 = new THREE.Mesh(
  informationBoardSize,
  informationBoardMaterial3
);

const informationBoard4 = new THREE.Mesh(
  informationBoardSize,
  informationBoardMaterial4
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
informationBoard2.position.x = -37;
informationBoard2.position.z = -60;
informationBoard3.position.y = 10;
informationBoard3.position.x = -53;
informationBoard3.position.z = -20;
informationBoard3.userData.name = "Vue3";
informationBoard3.lookAt(pillar3.position);
informationBoard4.position.x = 53;
informationBoard4.position.z = -20;
informationBoard4.position.y = 9;
informationBoard4.userData.name = "Crumble";
scene.add(
  informationBoard1,
  informationBoard2,
  informationBoard3,
  informationBoard4
);

//vilken form den har
const wallsize = new THREE.BoxGeometry(200, 120, 3, 400);
const sideWallSize = new THREE.BoxGeometry(3, 120, 200, 400);
const geometry = new THREE.BoxGeometry(50, 30, 2, 400);
const projectSideWall = new THREE.BoxGeometry(3, 30, 50, 400);
const wallmaterial = new THREE.MeshStandardMaterial({
  map: wallTexture,
});

const listSize = new THREE.BoxGeometry(1.2, 5, 200, 400);
const list = new THREE.Mesh(listSize, wallmaterial);
list.castShadow = true;
list.receiveShadow = true;
list.position.x = -94;
const listSize2 = new THREE.BoxGeometry(200, 5, 1.2, 400);
const list2 = new THREE.Mesh(listSize2, wallmaterial);
list2.position.z = -97;

const wallBack = new THREE.Mesh(wallsize, roofMaterial);
wallBack.receiveShadow = true;
wallBack.castShadow = true;
const wallLeft = new THREE.Mesh(sideWallSize, roofMaterial);
const wallRight = new THREE.Mesh(sideWallSize, roofMaterial);
roofMaterial.color.set(0xf7f2eb);
roofMaterial.opacity = 0.3;
wallLeft.position.y = 34;
wallLeft.position.x = -95;
wallBack.position.y = 34;
wallRight.position.y = 34;
wallRight.castShadow = true;
wallRight.receiveShadow = true;
wallRight.position.x = 100;
wallBack.position.z = -96;
wallLeft.castShadow = true;
//wrapper runt objektet

scene.background = new THREE.Color(0x000011);

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
const materialProject4 = new THREE.MeshBasicMaterial({
  map: crumbleProject,
});

const project1 = new THREE.Mesh(geometry, materialProject1);
project1.position.x = -48;
project1.position.z = -80;
project1.position.y = 32;
project1.userData.name = "ProjHTML";
// project1.material.color = "0xb9bf9f";
const project2 = new THREE.Mesh(geometry, materialProject2);
project2.position.x = 48;
project2.position.z = -80;
project2.position.y = 32;
project2.userData.name = "ProjJavaScript";

const project3 = new THREE.Mesh(projectSideWall, materialProject3);
project3.position.x = -94;
project3.position.y = 32;
project3.position.z = -20;
project3.userData.name = "ProjVue";

const project4 = new THREE.Mesh(projectSideWall, materialProject4);
project4.position.x = 97.4;
project4.position.y = 32;
project4.position.z = -20;
project4.userData.name = "ProjCrumble";

informationBoard4.lookAt(pillar4.position);

//hämtar det du vill ha till scenen
scene.add(
  project1,
  project2,
  wallBack,
  wallLeft,
  wallRight,
  project3,
  project4,
  list,
  list2
);

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
spotlight1.castShadow = true;
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

const spotlight3 = new THREE.SpotLight(0xffffff);
spotlight1.position.x = -100;
spotlight3.position.y = 20;
spotlight3.position.z = 30;
spotlight3.castShadow = true;
spotlight3.intensity = 0.6;
spotlight1.target.position.set(0, 10, 10);
// scene.add(spotlight3);

const pointLight = new THREE.PointLight(0xffffff);
const pointLight2 = new THREE.PointLight(0xffffff);
const pointLight3 = new THREE.PointLight(0xffffff);
pointLight3.intensity = 0.7;
pointLight3.castShadow = true;
pointLight3.position.y = 100;
pointLight3.position.x = 210;
pointLight3.position.z = -20;
const directinalLight = new THREE.DirectionalLight(0xffffff);
directinalLight.castShadow = true;
directinalLight.position.set(20, 100, 10);
directinalLight.target.position.set(0, 10, 10);
directinalLight.intensity = 0.4;
pointLight2.intensity = 0.6;
pointLight2.distance = 40;
pointLight2.decay = 0.2;
pointLight2.position.x = 50;
pointLight2.position.y = 37.56;
pointLight2.position.z = -57.22;
pointLight2.castShadow = true;
const pointLightHelper = new THREE.PointLightHelper(pointLight3);
pointLight.castShadow = true;
pointLight.intensity = 0.6;
pointLight.distance = 42.35;
pointLight.decay = 0.2;
pointLight.position.x = -35.68;
pointLight.position.y = 39.56;
pointLight.position.z = -56.22;
pointLight.castShadow = true;
scene.add(pointLight, pointLight1, pointLight2);

const controls = new PointerLockControls(camera, renderer.domElement);

const onKeyDown = function KeyboardEvent(event) {
  console.log(event.code);
  switch (event.code) {
    case "KeyW":
      controls.moveForward(1.62);
      break;
    case "KeyD":
      controls.moveRight(1.62);
      break;
    case "KeyS":
      controls.moveForward(-1.62);
      break;
    case "KeyA":
      controls.moveRight(-1.62);
      break;
  }
};
document.addEventListener("keydown", onKeyDown);

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

let siblingObject = null;

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
    }
    if (object.object.userData.name === "ProjVue") {
      clickedObject = object;
      goToLeftProject(clickedObject);
    }
    if (object.object.userData.name === "Vue3") {
      clickedObject = object;
      goToLeftInfoboard(clickedObject);
    }
    if (object.object.userData.name === "Crumble") {
      goToRightInfoboard(clickedObject);
    }
    if (object.object.userData.name === "ProjCrumble") {
      clickedObject = object;
      goToRightProject(clickedObject);
    }
    if (object.object.userData.name === "ProjHTML") {
      clickedObject = object;
      goToProject(clickedObject);
    }
    if (object.object.userData.name === "HTML") {
      clickedObject = object;
      goToInfoboard(clickedObject);
    }
    if (object.object.userData.name === "ProjJavaScript") {
      clickedObject = object;
      goToProject(clickedObject, siblingObject);
    }
    if (object.object.userData.name === "JavaScript") {
      clickedObject = object;
      goToInfoboard(clickedObject);
    }
  });
}

function goToRightProject(clickedObject) {
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: clickedObject.object.position.x - 30,
        y: clickedObject.object.position.y,
        z: clickedObject.object.position.z,
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
      HTMLLink.className = "link-HTML-active";
    })
    .start();
}

function goToLeftProject(clickedObject) {
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: clickedObject.object.position.x + 30,
        y: clickedObject.object.position.y,
        z: clickedObject.object.position.z,
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
      HTMLLink.className = "link-HTML-active";
    })
    .start();
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
      HTMLLink.className = "link-HTML-active";
    })
    .start();
}
function goToLeftInfoboard(clickedObject) {
  updateLeftCamera(clickedObject);
}

function goToInfoboard(clickedObject) {
  updateCamera(clickedObject);
}

let backText = document.querySelector(".back");
let textContainer = document.querySelector(".text-container");
textContainer.style.display = "none";
backText.addEventListener("click", getBack);
console.log(backText);

function getBack() {
  isZooming = false;
  textContainer.style.display = "none";
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: camera.position.x,
        y: 17,
        z: camera.position.z + 20,
      },
      1000
    )
    .onUpdate(() => {
      dimmUp();
    })
    .onComplete(() => {
      controls.lock();
    })
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

function blackOut() {
  const blackOutambientLight = new TWEEN.Tween(ambientLight)
    .to({ intensity: 0 }, 1000)
    .start();
}

function updateLeftCamera(clickedObject) {
  isZooming = true;
  const cameraMove = new TWEEN.Tween(camera.position)
    .to(
      {
        x: clickedObject.object.position.x + 10,
        y: clickedObject.object.position.y + 8,
        z: clickedObject.object.position.z,
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
