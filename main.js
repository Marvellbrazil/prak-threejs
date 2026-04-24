import { SceneManager } from "./src/SceneManager.js";
import { AssetLoader } from "./src/AssetLoader.js";
import * as THREE from 'three';

const canvas = document.querySelector('#webgl');
const world = new SceneManager(canvas);
const loader = new AssetLoader();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const spotLight = new THREE.SpotLight(0xffffff, 80);
spotLight.position.set(3, 3, 3);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.target.position.set(0, 0, 0);
world.add(ambientLight);
world.add(spotLight);
world.add(spotLight.target);

let targetRotationY = 0;
let accumulatedScroll = 0;

let isRightClick = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraTheta = 0;
let cameraPhi = Math.PI / 2;
let cameraRadius = 5;

function updateCameraPosition() {
    world.camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
    world.camera.position.y = cameraRadius * Math.cos(cameraPhi);
    world.camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
    world.camera.lookAt(0, 0, 0);
}

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
        isRightClick = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
        isRightClick = false;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isRightClick) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        cameraTheta -= deltaX * 0.01;
        cameraPhi -= deltaY * 0.01;
        cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi));
        
        updateCameraPosition();
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (e.ctrlKey) {
        const newRadius = cameraRadius + e.deltaY * 0.01;
        cameraRadius = Math.max(2, Math.min(10, newRadius));
        updateCameraPosition();
    } else if (!isRightClick) {
        accumulatedScroll += e.deltaY * 0.002;
        targetRotationY = accumulatedScroll;
    }
}, { passive: false });

async function init(glbPath) {
    try {
        const model = await loader.loadModel(glbPath);
        
        model.scale.set(1, 1, 1);
        world.add(model);
        
        world.addCSSLabel('Burger', new THREE.Vector3(0, 1.5, 0));
        
        world.animate(() => {
            model.rotation.y += (targetRotationY - model.rotation.y) * 0.1;
        });
        
        console.log('Model succesfully loaded');
        
        const loaderInfo = document.querySelector('#loader-info');
        if (loaderInfo) loaderInfo.remove();
    } catch (error) {
        console.error("Error when loading model", error);
    }
}

window.addEventListener('resize', () => world.onResize());

await init('./assets/burgir.glb');