import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `model/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    console.log(gltf);
    
    object = gltf.scene;
    scene.add(object);
    console.log('Model loaded and added to scene');
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z =  500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333,1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse


//Render the scene
function animate2() {
  requestAnimationFrame(animate2);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object) {
    //I've played with the constants here until it looked good 
    camera.position.set(0, 0, 1); // Set camera closer to the object

    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    scene.add(topLight);
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate2();



const bgImages = [];
const numBackgroundImages = 20;
const rotatingIndices = [];
const rotationImages = [];

// Load "oicat.png" for the stationary images
for (let i = 0; i < numBackgroundImages; i++) {
  const img = new Image();
  img.src = "./images/oicat.png"; // Stationary image
  bgImages.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 2 + 1,
    img: img,
  });
}

// Load "rot.png" for the rotating images
for (let i = 0; i < 5; i++) {
  const img = new Image();
  img.src = "./images/rot.png"; // Rotating image
  rotationImages.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 2 + 1,
    rotationSpeed: Math.random() * 20 - 0.5,
    img: img,
    angle: Math.random() * 360, // Random initial angle for rotation
  });
}

// Function to draw the background
function drawBackground() {
  ctx.globalAlpha = backgroundOpacity;

  // Draw non-rotating "oicat.png" images (stationary)
  bgImages.forEach((bg) => {
    ctx.drawImage(bg.img, bg.x, bg.y, 60, 80);
    bg.y += bg.speed;

    // Reset position if the image moves out of bounds
    if (bg.y >= canvas.height) {
      bg.y = -50;
      bg.x = Math.random() * canvas.width;
    }
  });

  // Draw rotating "rot.png" images (rotating and flowing)
  rotationImages.forEach((bg) => {
    ctx.save();

    // Rotate the image
    const centerX = bg.x + 30; // Half width of the image (60 / 2)
    const centerY = bg.y + 40; // Half height of the image (80 / 2)
    ctx.translate(centerX, centerY);
    ctx.rotate((bg.angle * Math.PI) / 180);
    ctx.drawImage(bg.img, -30, -40, 60, 80); // Draw the rotated image

    // Restore the context after transformations
    ctx.restore();

    // Update rotation and position
    bg.angle += bg.rotationSpeed;
    bg.y += bg.speed;

    // Reset position if the image moves out of bounds
    if (bg.y >= canvas.height) {
      bg.y = -50;
      bg.x = Math.random() * canvas.width;
      bg.angle = Math.random() * 360; // Reset to a random angle
    }
  });

  ctx.globalAlpha = 1;
}


const scaleX = Math.cos((bg.angle * Math.PI) / 180);
      ctx.scale(scaleX, 1); // Simulate rotation effect on x-axis