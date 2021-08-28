import "./style.css";
import * as THREE from "three";

//https://threejs-journey.xyz/lessons/5
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes Helper
// specify the length of the lines
const axesHelper = new THREE.AxesHelper(42);
scene.add(axesHelper);

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(30, 30, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x420690 });
// add a border to the box
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x420690,
  wireframe: true, // draw the wireframe
});
const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(wireframe);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// create a blue LineBasicMaterial
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x420690 });
// create the geometry with some vertices
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
lineGeometry.scale(4, 4, 4);
// create the Line
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  500
);
// move camera back
camera.position.set(0, 0, 69);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//prerender transforms

// now move the mesh box over to the bottom right
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1
// mesh.translateY(-10);
// mesh.translateX(50);
// rotate the mesh box around the y axis first, then x and z
mesh.rotation.reorder("YXZ");
mesh.rotateX(Math.PI * 0.25);
mesh.rotateY(Math.PI * 0.25);
console.log(mesh.rotation.toVector3());
mesh.scale.z = 2;
mesh.scale.y = 1;
mesh.scale.x = 1;
// set the wireframe scale the same as the mesh
wireframe.scale.copy(mesh.scale);
wireframe.scale.multiplyScalar(1.05);
wireframe.rotation.setFromQuaternion(mesh.quaternion);

line.position.x = -50;
line.position.y = -30;
line.position.z = 20;
// or all in once
line.position.set(-40, -20, 20);
line.scale.set(2, 2, 2);
line.rotation.setFromQuaternion(mesh.quaternion);

console.log(mesh.position.length());
console.log(mesh.position.distanceTo(line.position));
console.log(line.position.distanceTo(camera.position));

// all the methods from position are available on scale, ie. distanceTo, etc.
console.log(mesh.scale.lengthSq());
console.log(mesh.scale.length());
console.log(mesh.scale.distanceTo(line.scale));
// this will center the mesh box
// console.log(mesh.position.normalize());
renderer.render(scene, camera);
