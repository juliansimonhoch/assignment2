//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;

//-- GUI PARAMETERS
var gui;
const parameters = {
  form: 'Cube',
  
};

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let sceneList = [];
let frm = parameters.form;
let col = parameters.color;
let lastGeometry = parameters.form;

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;




// Parent Cube Class
class ParentCube {
  constructor(scene, center, size, iteration) {
    this.scene = scene;
    this.center = center;
    this.size = size;
    this.iteration = iteration;

    this.init();
  }

  init() {
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    const material = new THREE.MeshPhysicalMaterial();
    material.color.setRGB(Math.random(), 0, 0);
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(this.center.x, this.center.y, this.center.z);

    // Add the parent cube to the scene
    this.scene.add(this.mesh);
  }

  generateChildren() {
    this.generateChildrenCubes(this.center, this.size, this.iteration);
  }

  generateChildrenCubes(center, size, iteration) {
    if (iteration === 0) {
      return;
    }

   //Size
    const childsize = 0.45 * size;

    // Calculate corners of the parent cube
    const corners = [
      new THREE.Vector3(center.x + size / 2, center.y + size / 2, center.z + size / 2),
      new THREE.Vector3(center.x + size / 2, center.y + size / 2, center.z - size / 2),
      new THREE.Vector3(center.x + size / 2, center.y - size / 2, center.z + size / 2),
      new THREE.Vector3(center.x + size / 2, center.y - size / 2, center.z - size / 2),
      new THREE.Vector3(center.x - size / 2, center.y + size / 2, center.z + size / 2),
      new THREE.Vector3(center.x - size / 2, center.y + size / 2, center.z - size / 2),
      new THREE.Vector3(center.x - size / 2, center.y - size / 2, center.z + size / 2),
      new THREE.Vector3(center.x - size / 2, center.y - size / 2, center.z - size / 2),
    ];

    // Generate child cubes at each corner
    for (const corner of corners) {
      const childCube = new ParentCube(this.scene, corner, childsize, iteration - 1);
      childCube.generateChildrenCubes(corner, childsize, iteration - 1);
    }
  }
}




// Parent Pyramid Class
class ParentPyramid {
  constructor(scene, center, size, iteration) {
    this.scene = scene;
    this.center = center;
    this.size = size;
    this.iteration = iteration;

    this.init();
  }

  init() {
    const geometry = new THREE.ConeGeometry(this.size / 2, this.size, 4);
    const material = new THREE.MeshPhysicalMaterial();
    material.color.setRGB(Math.random(), 0, 0);
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(this.center.x, this.center.y, this.center.z);

    // Add the parent pyramid to the scene
    this.scene.add(this.mesh);
  }

  generateChildren() {
    this.generateChildrenPyramids(this.center, this.size, this.iteration);
  }

  generateChildrenPyramids(center, size, iteration) {
    if (iteration === 0) {
      return;
    }

   //Size
    const childSize = 0.3 * size;

    // Calculate corners of the parent pyramid
    const corners = [
      new THREE.Vector3(center.x + size / 2, center.y - size / 2, center.z),
      new THREE.Vector3(center.x - size / 2, center.y - size / 2, center.z),
      new THREE.Vector3(center.x, center.y + size / 2, center.z),
      new THREE.Vector3(center.x, center.y - size / 2, center.z + size / 2),
      new THREE.Vector3(center.x, center.y - size / 2, center.z - size / 2),
    ];

    // Generate child pyramids at each corner
    for (const corner of corners) {
      const childPyramid = new ParentPyramid(this.scene, corner, childSize, iteration - 1);
      childPyramid.generateChildrenPyramids(corner, childSize, iteration - 1);
    }
  }
}






// Update function for GUI changes
function updateGeometry() {

  // Remove existing objects from the scene
  sceneList.forEach((obj) => {
    removeObject(obj.mesh);
  });
  sceneList = [];

  // Check the selected form and recreate the geometry
  if (parameters.form === 'Pyramid') {
    const parentPyramidIterations = 5;
    const parentPyramid = new ParentPyramid(scene, new THREE.Vector3(0, 0, 0), 2, parentPyramidIterations);
    parentPyramid.generateChildren();
    sceneList.push(parentPyramid);
  } else if (parameters.form === 'Cube') {
    const parentCubeIterations = 4;
    const parentCube = new ParentCube(scene, new THREE.Vector3(0, 0, 0), 2, parentCubeIterations);
    parentCube.generateChildren();
    sceneList.push(parentCube);
  }
}




function main() {
  // GUI
  gui = new GUI();
  gui.add(parameters, 'form', ['Cube', 'Pyramid']).onChange(updateGeometry);
  
  // CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 500);
  camera.position.set(10, 10, 10);

  // LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 5, 5);
  directionalLight.target.position.set(-1, -1, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

   // CREATE Iterations according to the selected shape
  if (parameters.form == 'Pyramid') {
    const parentPyramidIterations = 5;
    const parentPyramid = new ParentPyramid(scene, new THREE.Vector3(0, 0, 0), 2, parentPyramidIterations);
    parentPyramid.generateChildren();
    sceneList.push(parentPyramid);
  }

  if (parameters.form == 'Cube') {
    const parentCubeIterations = 4;
    const parentCube = new ParentCube(scene, new THREE.Vector3(0, 0, 0), 2, parentCubeIterations);
    parentCube.generateChildren();
    sceneList.push(parentCube);
  }




  // CREATE RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);

  // CREATE MOUSE CONTROL
  control = new OrbitControls(camera, renderer.domElement);

  // ANIMATE
  animate();
}



// Remove Objects and clean the caches
function removeObject(sceneObject) {
  if (!(sceneObject instanceof THREE.Object3D)) return;

  // Remove the geometry to free GPU resources
  if (sceneObject.geometry) sceneObject.geometry.dispose();

  // Remove material to free GPU resources
  if (sceneObject.material instanceof Array) {
    sceneObject.material.forEach((material) => material.dispose());
  } else {
    sceneObject.material.dispose();
  }

  // Remove object from space
  sceneObject.removeFromParent();
}

// Remove the cubes
function removeCubes() {
  sceneList.forEach((element) => {
    removeObject(element.mesh);
  });

  sceneList = [];
}


//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

///ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);


  control.update();


  if (frm != parameters.form || col != parameters.color)  {
    updateGeometry();
    
  }

  renderer.render(scene, camera);
}




// Handle window resize
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});


// Start the main function
main();