import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Base
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

/**
 * Animate
 */
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

let i = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // use gsap to animate the mesh position
  gsap.to(mesh.position, {
    x: Math.sin(elapsedTime) * 0.5,
    y: Math.cos(elapsedTime) * 0.5,
    z: Math.sin(elapsedTime) * (Math.cos(elapsedTime) + 0.5),
  });

  // use gsap to animate the mesh rotation
  gsap.to(mesh.rotation, {
    duration: 10,
    y: Math.cos(elapsedTime) * 10,
    x: Math.sin(elapsedTime) * 10,
    repeat: -1,
    ease: "linear",
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
