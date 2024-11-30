const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const counterElement = document.getElementById("counter");
const audio = new Audio("./images/gun.mp3");
const audio2=new Audio("./images/miss.mp3");
const audio3=new Audio("./images/background.mp3")
let backgroundOpacity = 0.2; // Default opacity

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let showing=false;
// Initialize the hidden images counter
let hiddenCount = 0;
class Img {
    constructor(xpos, ypos, src, sizex, sizey, speed,src2) {
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
        this.img2=new Image();
        this.img2.src=src2;
    }

    draw(ctx) {
        if (this.visible) {
            // Draw the cat image
            ctx.drawImage(this.img, this.xpos, this.ypos, this.sizex, this.sizey);
            // Draw the cross always in front of the cat image\
        }
        if(showing){
            ctx.drawImage(this.img2, this.xpos, this.ypos, this.sizex, this.sizey);
        }
    }
    
    showings(){
      showing=true;
        setTimeout(()=>{
           showing=false;
        },2000)
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

            // Redraw the image and cross every frame
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
    new Img(canvas.width / 2 - 10, canvas.height / 2 - 10, "./images/0.png", 180, 180, 0.5,"./images/chat.png"),
    new Img(canvas.width / 3 - 20, canvas.height / 3 - 20, "./images/1.png", 180, 180, 0.5,"./images/chat.png"),
    new Img(canvas.width / 4 - 30, canvas.height / 4 - 30, "./images/2.png", 180, 180, 0.8,"./images/chat.png"),
    new Img(canvas.width / 5 - 40, canvas.height / 5 - 40, "./images/3.png", 180, 180, 0.6,"./images/chat.png"),
    new Img(canvas.width / 6 - 50, canvas.height / 6 - 50, "./images/4.png", 180, 180, 0.4,"./images/chat.png"),
    new Img(canvas.width / 7 - 60, canvas.height / 7 - 60, "./images/5.png", 180, 180, 0.7,"./images/chat.png"),
    new Img(canvas.width / 8 - 70, canvas.height / 8 - 70, "./images/6.png", 180, 180, 0.9,"./images/chat.png"),
    new Img(canvas.width / 2 - 90, canvas.height / 9 - 90, "./images/7.png", 180, 180, 0.4,"./images/chat.png"),
];

// Background images
const bgImages = [];
const numBackgroundImages = 20;

for (let i = 0; i < numBackgroundImages; i++) {
    bgImages.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        rotationSpeed: Math.random() * 20 - 0.5,
        img: new Image(),
    });
    bgImages[i].img.src = "./images/oicat.png";
    
}

const rotatingIndices = [];
while (rotatingIndices.length < 5) {
    const randIndex = Math.floor(Math.random() * bgImages.length);
    if (!rotatingIndices.includes(randIndex)) {
        rotatingIndices.push(randIndex);
    }
}

function drawBackground() {
    ctx.globalAlpha = backgroundOpacity;

    bgImages.forEach((bg, index) => {
        ctx.save();

        if (rotatingIndices.includes(index)) {
            // Rotate selected images
            const centerX = bg.x + 30; // Half width of the image (60 / 2)
            const centerY = bg.y + 40; // Half height of the image (80 / 2)
            ctx.translate(centerX, centerY);

            const scaleX = Math.cos((bg.angle * Math.PI) / 180);
            ctx.scale(scaleX, 1); // Simulate rotation effect on x-axis
            ctx.drawImage(bg.img, -30, -40, 60, 80);

            // Restore the context after transformations
            ctx.restore();

            // Update rotation properties for these images
            bg.angle += bg.rotationSpeed;
        } else {
            // Draw stationary images without rotation
            ctx.drawImage(bg.img, bg.x, bg.y, 60, 80);
        }

        // Update position for all images
        bg.y += bg.speed;

        // Reset position and angle if the image moves out of bounds
        if (bg.y >= canvas.height) {
            bg.y = -50;
            bg.x = Math.random() * canvas.width;
            bg.angle = Math.random() * 360; // Reset to a random angle
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
    
    counterElement.textContent="";

    // Create and display the typewriter text container
    const typewriterDiv = document.createElement("div");
    typewriterDiv.id = "typewriter";
    typewriterDiv.style.cssText = `
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5vw;
        font-family: monospace;
        color: white;
        text-align: center;
        font-family:'COD';
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
    audio3.play().catch((error) => {
        console.error("Error playing the sound:", error);
    });
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






function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    all_images.forEach((img) => img.update());

    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let clicked = false;
    all_images.forEach((img) => {
        
        if (img.isClicked(mouseX, mouseY)) {
            img.hide();
            // img.showings();
            clicked = true;
            audio.currentTime = 0;
            audio.play().catch((error) => {
                console.error("Error playing the sound:", error);
            });
            
        }
    });
    if (!clicked) {
        audio2.play();
    }
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
  `./model/${objToRender}/scene.gltf`,
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

let rotationAngle = 0; // To track the angle of rotation
let rotationComplete = false; // To check if 2 full rotations have been completed

function animate2() {
    requestAnimationFrame(animate2);
    
    // Make the eye move only if hiddenCount is less than 8
    if (object && hiddenCount < 8) {
        // Move the eye based on mouse position
        camera.position.set(0, 0, 1); // Set camera closer to the object
        
        // Restrict up/down rotation and allow left/right rotation
        const maxUpDownRotation = 0.5; // Max angle for up and down rotation
        const maxLeftRightRotation = 3; // Max angle for left and right rotation

        // Adjust the rotation based on mouse position
        // For up and down (x-axis), limit the rotation to within a range
        object.rotation.y = -2 + mouseX / window.innerWidth * maxLeftRightRotation;

        // For up and down (y-axis), restrict the rotation angle
        const upDownRotation = -1.2 + mouseY * 2.5 / window.innerHeight;
         object.rotation.x = Math.max(Math.min(upDownRotation, maxUpDownRotation), -maxUpDownRotation);
    } 
    
    
    // If hiddenCount reaches 8, start rotating the model
    if (hiddenCount >= 8 && !rotationComplete) {
        // Rotate the model two full rotations (720 degrees)
        rotationAngle += 1; // Increment by 1 degree per frame
        object.rotation.y += Math.PI / 180; // Rotate by 1 degree in radians
        
        // Check if 2 full rotations (720 degrees) have been completed
        if (rotationAngle >= 720) {
            rotationComplete = true; // Stop rotation after 2 full rotations
            // Reset the rotation to make the object face forward (0 rotation)
            object.rotation.set(0, 0, 0); // Reset rotation to front-facing (0, 0, 0)
            
            showTypewriterText(); // Trigger the typewriter function
        }
    }
    scene.add(topLight);
    renderer.render(scene, camera);

}
    


// Start the 3D rendering
animate2();



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
