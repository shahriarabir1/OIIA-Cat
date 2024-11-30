const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const counterElement = document.getElementById("counter");

let backgroundOpacity = 0.2; // Default opacity

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize the hidden images counter
let hiddenCount = 0;
showAnotherView();
class Img {
    constructor(xpos, ypos, src, sizex, sizey, speed) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.sizex = sizex;
        this.sizey = sizey;
        this.speed = speed;
        this.dx = Math.random() * this.speed * (Math.random() < 0.5 ? -1 : 1);
        this.dy = Math.random() * this.speed * (Math.random() < 0.5 ? -1 : 1);
        this.visible = true;

        this.img = new Image();
        this.img.src = src;
    }

    draw(ctx) {
        if (this.visible) {
            ctx.drawImage(this.img, this.xpos, this.ypos, this.sizex, this.sizey);
        }
    }

    update() {
        if (this.visible) {
            this.xpos += this.dx;
            this.ypos += this.dy;

            // Bounce off walls
            if (this.xpos <= 0 || this.xpos + this.sizex >= canvas.width) {
                this.dx *= -1;
            }
            if (this.ypos <= 0 || this.ypos + this.sizey >= canvas.height) {
                this.dy *= -1;
            }

            this.draw(ctx);
        }
    }

    hide() {
        if (this.visible) {
            this.visible = false;
            hiddenCount++;
            updateCounter();
            if (hiddenCount === all_images.length) {
                // Start typewriter immediately
                canvas.style.cursor = "default";
                
                showTypewriterText();
                
            }
        }
    }
    

    isClicked(x, y) {
        return (
            x >= this.xpos &&
            x <= this.xpos + this.sizex &&
            y >= this.ypos &&
            y <= this.ypos + this.sizey
        );
    }
}

// Main images
const all_images = [
    new Img(canvas.width / 2 - 10, canvas.height / 2 - 10, "images/0.png", 180, 180, 0.5),
    new Img(canvas.width / 3 - 20, canvas.height / 3 - 20, "images/1.png", 180, 180, 0.5),
    new Img(canvas.width / 4 - 30, canvas.height / 4 - 30, "images/2.png", 180, 180, 0.8),
    new Img(canvas.width / 5 - 40, canvas.height / 5 - 40, "images/3.png", 180, 180, 0.6),
    new Img(canvas.width / 6 - 50, canvas.height / 6 - 50, "images/4.png", 180, 180, 0.4),
    new Img(canvas.width / 7 - 60, canvas.height / 7 - 60, "images/5.png", 180, 180, 0.7),
    new Img(canvas.width / 8 - 70, canvas.height / 8 - 70, "images/6.png", 180, 180, 0.9),
    new Img(canvas.width / 2 - 90, canvas.height / 9 - 90, "images/7.png", 180, 180, 0.4),
];

// Background images
const bgImages = [];
const numBackgroundImages = 20;

for (let i = 0; i < numBackgroundImages; i++) {
    bgImages.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        
        img: new Image(),
    });
    bgImages[i].img.src = "images/oicat.png";
}

function drawBackground() {

        ctx.globalAlpha = backgroundOpacity;

    
    bgImages.forEach((bg) => {
        ctx.drawImage(bg.img, bg.x, bg.y, 60, 80);
        bg.y += bg.speed;

        if (bg.y >= canvas.height) {
            bg.y = -50;
            bg.x = Math.random() * canvas.width;
        }
    });
    ctx.globalAlpha = 1;
}

function updateCounter() {
    counterElement.textContent = `${hiddenCount}/${all_images.length}`;
}


function showTypewriterText() {
    // Hide unnecessary elements
    document.querySelector(".help").style.display = "none";
    document.querySelector(".center-text").style.display = "none";
    document.querySelector(".shot").style.display = "none";
    
    counterElement.style.display = "none";

    // Create and display the typewriter text container
    const typewriterDiv = document.createElement("div");
    typewriterDiv.id = "typewriter";
    typewriterDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-family: monospace;
        color: white;
        text-align: center;
    `;
    document.body.appendChild(typewriterDiv);

    const messages = [
        "Good Job Soldier!",
        "Your Ready to spin to billions"
    ];

    let currentMessageIndex = 0;

    function typeMessage(message, callback) {
        let i = 0;
        const typeInterval = setInterval(() => {
            typewriterDiv.textContent += message[i];
            i++;
            if (i === message.length) {
                clearInterval(typeInterval);
                setTimeout(() => callback(), 200); // Pause before erasing
            }
        }, 50);
    }

    function eraseMessage(callback) {
        const eraseInterval = setInterval(() => {
            typewriterDiv.textContent = typewriterDiv.textContent.slice(0, -1);
            if (typewriterDiv.textContent.length === 0) {
                clearInterval(eraseInterval);
                setTimeout(() => callback(), 200); // Pause before typing next message
            }
        }, 50);
    }

    function processMessages() {
        if (currentMessageIndex < messages.length) {
            const message = messages[currentMessageIndex];
            typeMessage(message, () => {
                eraseMessage(() => {
                    currentMessageIndex++;
                    processMessages(); // Move to the next message
                });
            });
        } else {
            typewriterDiv.remove(); // Remove typewriter after all messages
            showAnotherView(); // Proceed to the next phase
        }
    }

    processMessages();
}
function showAnotherView() {
    // Remove canvas and 3D model
    document.getElementById("container3D").innerHTML = ""; // Remove 3D content
    document.body.style.cursor='default';
    backgroundOpacity = 1;
    
    // Create a container for the new view
    const mother=document.createElement("div");
    mother.style.cssText= `width:100%`;
    const newView = document.createElement("div");
    newView.id = "newView";
    newView.style.cssText = `
        position: absolute;
        top: 50%;
        left: 40%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;'
        align-items: center;
        justify-content: center;
        z-index: 1000; /* Higher than canvas */
    `;
    mother.appendChild(newView);
    // Create a row for the text and overlay image
    const textAndImageRow = document.createElement("div");
    textAndImageRow.style.cssText = `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 250px; /* Shift the row 50px from the left side */
    margin-bottom: 20px; /* Space between this and explosion image */
    z-index: 1020; /* Ensure it is above the explosion image */
    position: relative;
`;
    
    // Add the overlay image
    const overlayImage = document.createElement("img");
    overlayImage.src = "images/oicat.png"; // Overlay image URL
    overlayImage.style.cssText = `
        
        height: 28vw;
        animation: shake 1s infinite;
    `;
    textAndImageRow.appendChild(overlayImage);
    const frontImage = document.createElement("img");
    frontImage.src = "images/chat.png"; // Front image URL
    frontImage.style.cssText = `
        position: absolute;
        z-index: 1030; /* Ensure it is above oicat */
        height: 20vw; /* Adjust size */
        left:-8%;
        top:-3%;
        animation: shakes 4.5s infinite;
    `;
    textAndImageRow.appendChild(frontImage);

    // Add the shaking texts (in flex column)
    const textColumn = document.createElement("div");
    textColumn.style.cssText = `
        display: flex;
        flex-direction: column;
        
        margin-left: 20px;
        white-space: nowrap; `;

    ["Spinning Cat", "TICKER $OIIAOIIA"].forEach((text, index) => {
        const textElement = document.createElement("div");
        textElement.textContent = text;
        textElement.style.cssText = `
            margin: 5px 0;
            font-size: ${index == 1 ? '2vw' : '7vw'};
            font-weight: bold;
            color: black;
            animation: shake 1s infinite;
            font-family: 'COD';
             text-shadow: 
            3px 3px 0px grey, 
            -3px -3px 0px grey,  
            3px -3px 0px grey, 
            -3px 3px 0px grey;
        `;
        textColumn.appendChild(textElement);
    });
    
    textAndImageRow.appendChild(textColumn);
    
    // Add the row with image and text to the view
    newView.appendChild(textAndImageRow);

    // Add the explosion image (now behind oicat and text)
    const explosionImage = document.createElement("img");
    explosionImage.src = "images/explosion.png"; // Main image URL
    explosionImage.style.cssText = `
        
        height: 38vw;
        z-index: 1010; /* Ensure it's behind the text and oicat */
        position: absolute; /* Position it absolutely to overlap */
        margin-top: -70px; /* Adjust for overlap */
    `;
    newView.appendChild(explosionImage);

    // Add another text under the explosion image
    const additionalText = document.createElement("div");
    additionalText.textContent = "VAXZXMFXV8TMSD72HUN22EX6GFZZ5UQDVJWAPUMP";
    additionalText.style.cssText = `
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        color: black;
        font-family:'COD';
        z-index:20000
    `;
    newView.appendChild(additionalText);

    // Append the new view to the body
    document.body.appendChild(newView);

    // CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    10% { transform: rotate(2deg); }
    20% { transform: rotate(-4deg); }
    30% { transform: rotate(2.5deg); }
    40% { transform: rotate(-4.5deg); }
    50% { transform: rotate(3.0deg); }
    60% { transform: rotate(-5.0deg); }
    70% { transform: rotate(3.5deg); }
    80% { transform: rotate(-5.5deg); }
    90% { transform: rotate(4.0deg); }
}
    @keyframes shakes {
    0%, 100% {
        transform: translateY(0);
    }
    10% {
        transform: translateY(-5px); /* Move up */
    }
    20% {
        transform: translateY(5px); /* Move down */
    }
    30% {
        transform: translateY(-5px);
    }
    40% {
        transform: translateY(5px);
    }
    50% {
        transform: translateY(-5px);
    }
    60% {
        transform: translateY(5px);
    }
    70% {
        transform: translateY(-5px);
    }
    80% {
        transform: translateY(5px);
    }
    90% {
        transform: translateY(-5px);
    }
}
    
    `;
    document.head.appendChild(style);
}




function drawBackground() {
    ctx.globalAlpha = backgroundOpacity;

    bgImages.forEach((bg) => {
        ctx.save();

        // Move to the image's center
        const centerX = bg.x + 30; // Half width of the image (60 / 2)
        const centerY = bg.y + 40; // Half height of the image (80 / 2)
        ctx.translate(centerX, centerY);

        // Rotate the image in the x-axis direction
        ctx.scale(1, Math.cos((bg.angle * Math.PI) / 180)); // Simulate x-axis rotation

        // Draw the image
        ctx.drawImage(bg.img, -30, -40, 60, 80);

        // Restore context state
        ctx.restore();

        // Update position and rotation
        bg.y += bg.speed;
        bg.angle += bg.rotationSpeed;

        // Reset position and angle if the image moves out of bounds
        if (bg.y >= canvas.height) {
            bg.y = -50;
            bg.x = Math.random() * canvas.width;
            bg.angle = Math.random() / 180; // Reset to a random angle
        }
    });

    ctx.globalAlpha = 1;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    all_images.forEach((img) => img.update());

    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    all_images.forEach((img) => {
        if (img.isClicked(mouseX, mouseY)) {
            img.hide();
        }
    });
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();



///three js
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


//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `model/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    
    
    object = gltf.scene;
    scene.add(object);
   
  },
  function (xhr) {
    //While it is loading, log the progress
    
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

const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // Top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1); // Dim ambient light
scene.add(ambientLight);

// Add additional lights for brightness
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Color, intensity, distance
pointLight.position.set(0, 0, 10); // Position near the camera
scene.add(pointLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1); // (sky color, ground color, intensity)
scene.add(hemiLight);
//This adds controls to the camera, so we can rotate / zoom it with the mouse

let l;
//Render the scene
function animate2() {
  requestAnimationFrame(animate2);
  

  //Make the eye move
  if (object) {
    camera.position.set(0, 0, 1); // Set camera closer to the object
    if(hiddenCount<8){
        object.rotation.y = -2 + mouseX / window.innerWidth * 3;
        object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
        object.rotation.y = -2 + mouseX / window.innerWidth * 3;
        object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }else{
        if(l){
            object.rotation.x+=5;
        }
        setTimeout(()=>{
            l=false;
        },2000)

    }

    scene.add(topLight);
  }
  renderer.render(scene, camera);
}
// function animate3(){
//     requestAnimationFrame(animate3);


//     object.rotation.y += 0.05;

//     renderer.render(scene, camera);
// }
//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
    if (hiddenCount < 8) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
}

//Start the 3D rendering
animate2();
