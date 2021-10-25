import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(2, 2, 2);
// light purple material
const material = new THREE.MeshBasicMaterial({
  color: 0x9933ff,
  wireframe: true,
});
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.set(0.69, 0.69, 0.69);
scene.add(mesh);

// Sizes
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// use event handlers to resize the canvas when the browser window is resized
window.addEventListener("resize", () => {
  // update the canvas size
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

let time = Date.now();
const clock = new THREE.Clock();
// start out going forward
let direction = 1;

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;
  const elapsedTime = clock.getElapsedTime();
  //   const time = Date.now();

  mesh.rotation.x += 0.005 * Math.cos(elapsedTime);
  mesh.rotation.y += 0.01 * Math.sin(elapsedTime);
  mesh.rotation.z += 0.01 * Math.cos(elapsedTime);

  //   console.log(deltaTime);

  // this set the scale between 0.5 and 2
  //   mesh.scale.x = 0.5 + 0.5 * Math.sin(time / 1000);
  //   mesh.scale.y = 0.5 + 0.5 * Math.sin(time / 1000);
  //   mesh.scale.z = 0.5 + 0.5 * Math.sin(time / 1000);

  // change the scale of the mesh between the range 0.69 and 1.420
  const meshScale = mesh.scale.x + 0.01 * direction;
  if (meshScale >= 1.31 || meshScale <= 0.69) {
    direction *= -1;
  }
  //   console.log(Math.sin(elapsedTime));
  mesh.scale.set(meshScale, meshScale, meshScale);

  // set the scale of the mesh between the range 0.1 and 2
  // wtf is this?
  //   mesh.scale.set(
  //     0.1 + 0.2 * Math.sin(deltaTime * 0.001),
  //     0.1 + 0.2 * Math.sin(deltaTime * 0.001),
  //     0.1 + 0.2 * Math.sin(deltaTime * 0.001)
  //   );

  // sets the color of the mesh between the range 0x0000ff and 0xff0000
  //   mesh.material.color.setHex(0x0000ff + 0xff0000 * Math.sin(deltaTime * 0.001));

  // sets the color of the mesh randomly
  mesh.material.color.setHex(Math.random() * 0xffffff);

  mesh.position.x = Math.sin(elapsedTime);
  mesh.position.y = Math.cos(elapsedTime);

  // cool for parallax effects
  //   camera.position.x = Math.cos(elapsedTime);
  //   camera.position.y = Math.sin(elapsedTime);
  //   camera.lookAt(mesh.position);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
