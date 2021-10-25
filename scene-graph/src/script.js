import "./style.css";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

// Turns both axes and grid visible on/off
// GUI requires a property that returns a bool
// to decide to make a checkbox so we make a setter
// can getter for `visible` which we can tell GUI
// to look at.
class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

function main() {
  const canvas = document.querySelector("#c");
  const gui = new GUI();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 100, 0);
  camera.up.set(0, 0, -10);
  camera.lookAt(10, 0, -10);

  const scene = new THREE.Scene();

  // inner block for the light
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // an array for the various nodes within the solar system scene, including the solar system itself
  const objects = [];

  const radius = Math.PI / 3;
  const widthSegments = 60;
  const heightSegments = 60;
  const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  // adding an empty scene graph node
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  // make sun
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(10, 10, 10);
  // add the sphere to the solar system instead of the scene
  // scene.add(sunMesh);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  const earth = {
    name: "Earth",
    distance: 33,
    orbitalPeriod: 365.26,
    rotationPeriod: 1,
    radius: 1,
    color: 0x2233ff,
    emissive: 0x112244,
  };

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.set(earth.distance, 0, 0);

  // add the planet to the solar system instead of the scene
  solarSystem.add(earthOrbit);
  // add earth orbit to the objects array
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: earth.color,
    emissive: earth.emissive,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  // earthMesh.position.x = earth.distance; // old way - part of the orbit now
  // add the earth mesh as a child of the sun mesh (old way)
  // sunMesh.add(earthMesh);
  // add the earth mesh to the solar system instead of the scene so it doesn't inherit the scale of the sun
  // solarSystem.add(earthMesh);
  earthOrbit.add(earthMesh);

  // if we don't specify the scale of the earth mesh while it is a child of the sun,
  // it would inherit the scale of the sun mesh
  // earthMesh.scale.set(0.5, 0.5, 0.5);

  // debug helpers
  makeAxisGrid(earthMesh, `Earth mesh`);
  makeAxisGrid(earthOrbit, `Earth orbit`);

  objects.push(earthMesh);

  const moonOrbit = new THREE.Object3D();
  // relative to the earth
  moonOrbit.position.set(2, 0, 0);
  // add the moon orbit as a child of the earth orbit, which is a part of the objects array and the solar system
  earthOrbit.add(moonOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888, //grey
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.33, 0.33, 0.33);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  makeAxisGrid(moonMesh, `Moon mesh`);
  makeAxisGrid(moonOrbit, `Moon orbit`);

  // all the other planets
  const planets = [
    {
      name: "Mercury",
      distance: 15,
      orbitalPeriod: 87.97,
      rotationPeriod: 58.64,
      radius: 0.383,
      color: 0x888888,
      emissive: 0x222222,
    },
    {
      name: "Venus",
      distance: 25,
      orbitalPeriod: 224.7,
      rotationPeriod: -243.01,
      radius: 0.949,
      color: 0x888888,
      emissive: 0x222222,
    },
    {
      name: "Mars",
      distance: 50,
      orbitalPeriod: 686.98,
      rotationPeriod: 1.03,
      radius: 0.532,
      color: 0x888888,
      emissive: 0x222222,
    },
    {
      name: "Jupiter",
      distance: 75,
      orbitalPeriod: 4332.59,
      rotationPeriod: 0.41,
      radius: 11.21,
      color: 0xbcafb2,
      emissive: 0x222222,
    },
    {
      name: "Saturn",
      distance: 105,
      orbitalPeriod: 10759.22,
      rotationPeriod: 0.45,
      radius: 9.45,
      color: 0x888888,
      emissive: 0x222222,
    },
    {
      name: "Uranus",
      distance: 130,
      orbitalPeriod: 30687.15,
      rotationPeriod: 0.72,
      radius: 4.01,
      color: 0x888888,
      emissive: 0x222222,
    },
  ];

  planets.map((planet) => {
    const planetOrbit = new THREE.Object3D();
    planetOrbit.position.x = planet.distance;
    planetOrbit.planet = planet;

    // create a mesh for each planet
    const planetMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshPhongMaterial({
        color: planet.color,
        emissive: planet.emissive,
      })
    );
    planetMesh.scale.set(planet.radius, planet.radius, planet.radius);
    planetMesh.planet = planet;

    makeAxisGrid(planetMesh, `${planet.name} mesh`);
    makeAxisGrid(planetOrbit, `${planet.name} orbit`);

    planetOrbit.add(planetMesh);
    // add the planet orbit as a child of the solar system to display it
    solarSystem.add(planetOrbit);
    // add each planet orbit and mesh to the objects array
    objects.push(planetOrbit);
    objects.push(planetMesh);
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    // convert to seconds, using that to update the rotation of the planets
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      // console.log(obj);
      // planet rotation
      if ("planet" in obj) {
        // obj.rotation.y += obj.planet.rotationPeriod * time;
      } else {
        // set the rotation period of the other items (like the sun)
        obj.rotation.y = time;
      }
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
