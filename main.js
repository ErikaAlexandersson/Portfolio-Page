import * as THREE from "three";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as TWEEN from "@tweenjs/tween.js";
import { GUI } from "dat.gui";

let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 20;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.35);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xf5f1e7);
  ambientLight.intensity = 0;

  scene.add(ambientLight);

  controls = new PointerLockControls(camera, document.body);

  const instructions = document.getElementById("instructions");
  const arrowControls = document.getElementById("controls-during");
  instructions.addEventListener("click", function () {
    controls.lock();
  });
  let move = true;

  window.addEventListener("keydown", (e) => {
    if (e.key === " " && move === true) {
      controls.lock();
      move = false;
    }
    if (e.key === " " && move === false) {
      controls.unlock();
      move = true;
    }
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    const dimAmbientLight = new TWEEN.Tween(ambientLight)
      .to({ intensity: 0.5 }, 1000)
      .start();
    const dimHemisphereLight = new TWEEN.Tween(light)
      .to({ intensity: 0.55 }, 1000)
      .start();
    console.log("Nu är vi i lock");
    // console.log(arrowControls.childNodes);
    move = true;
  });

  controls.addEventListener("unlock", function () {
    // blocker.style.display = "block";
    // instructions.style.display = "";
    // arrowControls.style.display = "flex";
    console.log("Nu är vi i unlock");
    move = false;
  });

  scene.add(controls.getObject());

  let pElement = document.querySelectorAll("p");
  const onKeyDown = function (event) {
    // pElement.forEach((element) => {
    //   if (element.firstChild.textContent === "A") {
    //     console.log("A är hittat");
    //   }
    //   console.log(element.firstChild.textContent);
    // });
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  // floor
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
  floorMaterial.roughness = 2;
  floorMaterial.encoding = THREE.sRGBEncoding;

  let floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  scene.add(floor);

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
  roof.position.y = 90;
  roof.rotation.x -= Math.PI / 2;

  scene.add(roof);

  // objects

  const pillarSize = new THREE.CylinderGeometry(0.2, 0.2, 10, 10);
  const wire = new THREE.CylinderGeometry(0.1, 0.1, 60, 10);
  const wireMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  let wireLoop = "";
  let wires = [];

  for (let i = 1; i <= 9; i++) {
    wireLoop = new THREE.Mesh(wire, wireMaterial);
    wires.push(wireLoop);
    scene.add(wireLoop);
    wireLoop.position.x = 20 + i;
  }
  wires[0].position.set(-65, 60, -85);
  wires[0].castShadow = true;
  wires[1].position.set(35, 60, -85);
  wires[1].castShadow = true;
  wires[2].position.set(65, 60, -85);
  wires[2].castShadow = true;
  wires[3].position.set(-85, 60, -25);
  wires[3].castShadow = true;
  wires[4].position.set(-85, 60, 6);
  wires[4].castShadow = true;
  wires[5].position.set(90, 60, 5);
  wires[5].castShadow = true;
  wires[6].position.set(90, 60, -25);
  wires[6].castShadow = true;
  wires[7].position.set(-20, 60, 60);
  wires[7].castShadow = true;
  wires[8].position.set(20, 60, 60);
  wires[8].castShadow = true;

  const wire1 = new THREE.Mesh(wire, wireMaterial);
  wire1.position.set(-35, 60, -85);
  const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const pillar1 = new THREE.Mesh(pillarSize, pillarMaterial);
  const pillar2 = new THREE.Mesh(pillarSize, pillarMaterial);
  const pillar3 = new THREE.Mesh(pillarSize, pillarMaterial);
  const pillar4 = new THREE.Mesh(pillarSize, pillarMaterial);
  pillar1.userData.name = "JavaScript";
  pillar1.position.set(50, 5, -61);
  pillar2.userData.name = "HTML";
  pillar2.position.set(-37, 5, -61);
  pillar2.userData.name = "Vue3";
  pillar3.position.set(-62, 5, -10);
  pillar4.userData.name = "Crumble";
  pillar4.position.set(63, 5, -10);

  scene.add(pillar1, pillar2, pillar3, pillar4, wire1);

  const wallTexture = new THREE.TextureLoader().load(
    "assets/concrete3-albedo.png"
  );
  wallTexture.magFilter = THREE.NearestFilter;
  wallTexture.roughness = 1;

  const texture = new THREE.TextureLoader().load("assets/home.png");
  texture.magFilter = THREE.NearestFilter;
  const textureProject2 = new THREE.TextureLoader().load("assets/nativeJS.png");
  textureProject2.magFilter = THREE.NearestFilter;
  const viteProject = new THREE.TextureLoader().load("assets/vite.jpeg");
  const crumbleProject = new THREE.TextureLoader().load("assets/crumble.png");
  const about = new THREE.TextureLoader().load("assets/omMig.png");

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

  const lookAt = new THREE.Vector3(0, 12, 10);
  informationBoard1.lookAt(lookAt);
  informationBoard1.position.set(50, 10, -60);
  informationBoard1.userData.name = "JavaScript";
  informationBoard1.scale.set(1, 1, 1);

  const lookAt2 = new THREE.Vector3(0, 12, 10);
  informationBoard2.lookAt(lookAt2);
  informationBoard2.position.set(-37, 10, -60);
  informationBoard2.userData.name = "HTML";

  const lookAt4 = new THREE.Vector3(40, 32, 0);
  informationBoard3.lookAt(lookAt4);
  informationBoard3.position.set(-60, 10, -10);
  informationBoard3.userData.name = "Vue3";
  const lookAt3 = new THREE.Vector3(-40, 32, 0);
  informationBoard4.lookAt(lookAt3);
  informationBoard4.position.set(62, 10, -10);
  informationBoard4.userData.name = "Crumble";

  scene.add(
    informationBoard1,
    informationBoard2,
    informationBoard3,
    informationBoard4
  );

  const wallsize = new THREE.BoxGeometry(200, 120, 3, 400);
  const sideWallSize = new THREE.BoxGeometry(3, 120, 200, 400);
  const geometry = new THREE.BoxGeometry(50, 30, 2, 400);
  const projectSideWall = new THREE.BoxGeometry(3, 30, 50, 400);
  const wallmaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
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

  const wallBack = new THREE.Mesh(wallsize, roofMaterial);
  wallBack.receiveShadow = true;
  const wallFront = new THREE.Mesh(wallsize, roofMaterial);
  const wallLeft = new THREE.Mesh(sideWallSize, roofMaterial);
  const wallRight = new THREE.Mesh(sideWallSize, roofMaterial);
  roofMaterial.color.set(0xf7f2eb);
  roofMaterial.opacity = 0.3;
  wallLeft.position.set(-95, 34, 0);
  wallLeft.receiveShadow = true;
  wallBack.position.set(0, 34, -96);
  wallBack.receiveShadow = true;
  wallRight.position.set(100, 34, 0);
  wallRight.receiveShadow = true;
  wallFront.position.set(0, 34, 70);
  wallFront.receiveShadow = true;

  scene.background = new THREE.Color(0x000011);

  const project1 = new THREE.Mesh(geometry, [
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right,
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right
    }),
    new THREE.MeshBasicMaterial({
      color: "0xffffff", // top
    }),
    new THREE.MeshBasicMaterial({
      color: "0xffffff", // bottom
    }),
    new THREE.MeshBasicMaterial({
      map: texture, // front
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //back
    }),
  ]);
  project1.position.set(-48, 32, -85);
  project1.castShadow = true;
  project1.userData.name = "ProjHTML";

  const project2 = new THREE.Mesh(geometry, [
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right,
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right
    }),
    new THREE.MeshBasicMaterial({
      color: "0xffffff", // top
    }),
    new THREE.MeshBasicMaterial({
      color: "0xffffff", // bottom
    }),
    new THREE.MeshBasicMaterial({
      map: textureProject2, // front
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //back
    }),
  ]);
  project2.position.set(48, 32, -85);
  project2.castShadow = true;
  project2.userData.name = "ProjJavaScript";

  const project3 = new THREE.Mesh(projectSideWall, [
    new THREE.MeshBasicMaterial({
      map: viteProject, //right,
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // top
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // bottom
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff",
      // front
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //back
    }),
  ]);
  project3.position.set(-85, 32, -10);
  project3.castShadow = true;
  project3.userData.name = "ProjVue";

  const project4 = new THREE.Mesh(projectSideWall, [
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right,
    }),
    new THREE.MeshBasicMaterial({
      map: crumbleProject, //right
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // top
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // bottom
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // front
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //back
    }),
  ]);
  project4.position.set(90, 32, -10);
  project4.castShadow = true;
  project4.userData.name = "ProjCrumble";

  const project5 = new THREE.Mesh(geometry, [
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", //right,
    }),
    new THREE.MeshBasicMaterial({
      color: "0xffffff", //back
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // top
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // bottom
    }),
    new THREE.MeshPhysicalMaterial({
      color: "0xffffff", // front
    }),
    new THREE.MeshBasicMaterial({
      map: about, //right
    }),
  ]);
  project5.position.set(0, 32, 60);
  project5.castShadow = true;
  project5.userData.name = "About";

  scene.add(
    project1,
    project2,
    wallBack,
    wallLeft,
    wallRight,
    wallFront,
    project3,
    project4,
    project5
  );

  const spotlight1 = new THREE.SpotLight(0xffffff, 0.7, 0, 0.4, 1, 2.4);
  spotlight1.position.set(-28.86, -3.5, 49.69);
  spotlight1.castShadow = true;
  scene.add(spotlight1);

  const spotlight2 = new THREE.SpotLight(0xffffff, 0.7, 0, 0.4, 1, 2.4);
  spotlight2.position.set(19.91, -3.5, 49.69);
  spotlight2.castShadow = true;
  scene.add(spotlight2);

  const spotlight3 = new THREE.SpotLight(0xffffff, 0.7, 300, 0.5, 1, 2.4);
  spotlight3.position.set(0, -19.5, -49.69);
  spotlight3.castShadow = true;

  scene.add(spotlight3);

  const pointLigthz = new THREE.PointLight(0xffffff, 0.7, 100, 2);
  pointLigthz.position.set(0, 80, 30);
  scene.add(pointLigthz);

  const spotlight4 = new THREE.SpotLight(0xffffff, 0.4, 0, 0.5, 1, 2);
  spotlight4.position.set(10, -3.5, 1);
  spotlight4.castShadow = true;

  const spotlight5 = new THREE.SpotLight(0xffffff, 0.4, 0, 0.5, 1, 2);
  spotlight5.position.set(-10, -3.5, 1);
  spotlight5.castShadow = true;
  scene.add(spotlight5, spotlight4, spotlight4);

  const pointLight = new THREE.PointLight(0xd3d3d3, 0.2, 20, 0.1);
  pointLight.castShadow = true;
  pointLight.position.set(-37.68, 15, -60);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.2, 20, 0.1);
  pointLight2.castShadow = true;
  pointLight2.position.set(50, 15, -60.22);

  const pointLight3 = new THREE.PointLight(0xffffff, 0.2, 20, 0.1);
  pointLight3.castShadow = true;
  pointLight3.position.set(-57, 15, -10);

  const pointLight4 = new THREE.PointLight(0xffffff, 0.2, 20, 0.1);
  pointLight4.castShadow = true;
  pointLight4.position.set(63, 15, -10);
  scene.add(pointLight, pointLight2, pointLight3, pointLight4);

  window.addEventListener("click", onMouseClick);

  const mouse = new THREE.Vector2();

  let HTMLLink = document.querySelector(".link-HTML");
  let isZooming = false;
  let clickedObject = null;

  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach((object) => {
      if (object.object.userData.name === "ProjJavaScript") {
        backText.className = "ProjBack";
        clickedObject = object;
        HTMLLink.setAttribute(
          "href",
          "https://github.com/ErikaAlexandersson/Native-JavaScript"
        );
        goToProject(clickedObject);
      }
      if (object.object.userData.name === "ProjVue") {
        backText.className = "projLeft";
        clickedObject = object;
        HTMLLink.setAttribute(
          "href",
          "https://github.com/ErikaAlexandersson/receptgeneratorn"
        );
        goToProject(clickedObject);
      }
      if (object.object.userData.name === "Vue3") {
        backText.className = "left";
        clickedObject = object;
        goToInfoboard(clickedObject);
      }
      if (object.object.userData.name === "Crumble") {
        clickedObject = object;
        backText.className = "right";
        goToInfoboard(clickedObject);
      }
      if (object.object.userData.name === "ProjCrumble") {
        backText.className = "projRight";
        clickedObject = object;
        goToProject(clickedObject);
      }
      if (object.object.userData.name === "ProjHTML") {
        backText.className = "projBack";
        clickedObject = object;
        goToProject(clickedObject);
      }
      if (object.object.userData.name === "ProjJavaScript") {
        backText.className = "projBack";
        clickedObject = object;
        goToProject(clickedObject);
      }
      if (
        object.object.userData.name === "HTML" ||
        object.object.userData.name === "JavaScript"
      ) {
        backText.className = "back";
        clickedObject = object;
        goToInfoboard(clickedObject);
      }
    });
  }

  function goToProject(clickedObject) {
    let positionX = 0;
    let positionY = 0;
    let positionZ = 0;

    if (backText.className === "projLeft") {
      positionX = 30;
    }
    if (backText.className === "projBack") {
      positionZ = 30;
    }
    if (backText.className === "projRight") {
      positionX = -30;
    }
    const cameraMove = new TWEEN.Tween(camera.position)
      .to(
        {
          x: clickedObject.object.position.x + positionX,
          y: clickedObject.object.position.y + positionY,
          z: clickedObject.object.position.z + positionZ,
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

  function goToInfoboard(clickedObject) {
    updateCamera(clickedObject);
  }

  let backText = document.querySelector(".back");
  backText.addEventListener("click", getBack);
  let textContainer = document.querySelector(".text-container");
  textContainer.style.display = "none";
  backText.addEventListener("click", getBack);

  function getBack(event) {
    textContainer.style.display = "none";
    console.log(clickedObject.object.userData.name);
    isZooming = false;
    let positionX = 0;
    let positionY = 0;
    let positionZ = 0;
    if (backText.className === "back") {
      positionY = 5;
      positionZ = 20;
      scaleInformation(clickedObject);
    }
    if (backText.className === "projBack") {
      positionY = -10;
      positionZ = 20;
    }
    if (backText.className === "right") {
      positionY = 5;
      positionX = -20;
      scaleInformation(clickedObject);
    }
    if (backText.className === "projRight") {
      positionY = -10;
      positionX = -20;
    }
    if (backText.className === "left") {
      positionY = 5;
      positionX = -20;
      scaleInformation(clickedObject);
    }
    if (backText.className === "projLeft") {
      positionY = -8;
      positionX = 20;
    }
    console.log(backText.className);

    const cameraMove = new TWEEN.Tween(camera.position)
      .to(
        {
          x: camera.position.x + positionX,
          y: camera.position.y + positionY,
          z: camera.position.z + positionZ,
        },
        1000
      )
      .onUpdate(() => {
        dimmUp(clickedObject);
      })
      .onComplete(() => {
        controls.lock();
      })
      .start();
  }

  function dimmUp(clickedObject) {
    let whatPointlight = "";
    let whatSpotlight = "";
    if (clickedObject.object.userData.name === "HTML") {
      whatPointlight = pointLight;
      whatSpotlight = spotlight1;
    }
    if (clickedObject.object.userData.name === "JavaScript") {
      whatPointlight = pointLight2;
      whatSpotlight = spotlight2;
    }
    if (clickedObject.object.userData.name === "Vue3") {
      whatPointlight = pointLight3;
      whatSpotlight = spotlight4;
    }
    if (clickedObject.object.userData.name === "Crumble") {
      whatPointlight = pointLight4;
      whatSpotlight = spotlight5;
    }
    const dimmer1 = new TWEEN.Tween(whatPointlight)
      .to({ intensity: 0.6 }, 1000)
      .start();
    const dimmerPoint = new TWEEN.Tween(whatSpotlight)
      .to({ intensity: 0.8 }, 1000)
      .start();
    const dimAmbientLight = new TWEEN.Tween(ambientLight)
      .to({ intensity: 0.5 }, 1000)
      .start();
  }

  function dimmLight(clickedObject) {
    let whatSpotlight = "";
    let whatPointlight = "";
    if (clickedObject.object.userData.name === "HTML") {
      whatSpotlight = spotlight1;
      whatPointlight = pointLight;
    }
    if (clickedObject.object.userData.name === "JavaScript") {
      whatPointlight = pointLight2;
      whatSpotlight = spotlight2;
    }
    if (clickedObject.object.userData.name === "Vue3") {
      whatPointlight = pointLight3;
      whatSpotlight = spotlight4;
    }
    if (clickedObject.object.userData.name === "Crumble") {
      whatPointlight = pointLight4;
      whatSpotlight = spotlight5;
    }
    const dimmer1 = new TWEEN.Tween(whatSpotlight)
      .to({ intensity: 0 }, 1000)
      .start();
    const dimmerPoint = new TWEEN.Tween(pointLight)
      .to({ intensity: 0 }, 1000)
      .start();
    const dimAmbientLight = new TWEEN.Tween(ambientLight)
      .to({ intensity: 0.1 }, 1000)
      .start();
  }

  function updateCamera(clickedObject) {
    let positionX = 0;
    let positionY = 0;
    let positionZ = 0;
    isZooming = true;

    if (backText.className === "back") {
      positionY = 5;
      positionZ = 10;
    }
    if (backText.className === "left") {
      positionX = 10;
      positionY = 8;
    }
    if (backText.className === "right") {
      positionX = -10;
      positionY = 7;
    }
    const cameraMove = new TWEEN.Tween(camera.position)
      .to(
        {
          x: clickedObject.object.position.x + positionX,
          y: clickedObject.object.position.y + positionY,
          z: clickedObject.object.position.z + positionZ,
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
        dimmLight(clickedObject);
      })
      .start();
  }

  function scaleInformation(clickedObject) {
    if (isZooming === true) {
      let tween = new TWEEN.Tween(clickedObject.object.scale)
        .to({ x: 2.3, y: 1.2, z: 0 }, 1000)
        .yoyo(true)
        .onComplete(() => {
          textContainer.style.display = "block";
          HTMLLink.className = "link-HTML-active";
        })
        .start();
    }
    if (isZooming === false) {
      let tween = new TWEEN.Tween(clickedObject.object.scale)
        .to({ x: 1, y: 1, z: 0 }, 1000)
        .yoyo(true)
        .onComplete(() => {
          // textContainer.style.display = "block";
          // HTMLLink.className = "link-HTML-active";
        })
        .start();
    }
  }

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
