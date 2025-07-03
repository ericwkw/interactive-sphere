import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/lil-gui@0.19.1/dist/lil-gui.esm.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

// GUI Parameters
const params = {
    texture: 'None',
    'Rotation Speed': 0.01,
    'Metallic Finish': 0.0,
    'Surface Roughness': 0.5,
    'Clear Coat Shine': 0.0,
    transmission: 1.0,
    thickness: 0.5,
    'Shape Intensity': 0.0,
    'Base Color': 0xffffff,
    'Color Hue Offset': 0,
    'Color Saturation': 100,
    'Color Brightness': 50,
    reset: () => resetSphere()
};

const initialParams = {
    texture: 'None',
    'Rotation Speed': 0.01,
    'Metallic Finish': 0.0,
    'Surface Roughness': 0.5,
    'Clear Coat Shine': 0.0,
    transmission: 1.0,
    thickness: 0.5,
    'Shape Intensity': 0.0,
    'Base Color': 0xffffff,
    'Color Hue Offset': 0,
    'Color Saturation': 100,
    'Color Brightness': 50,
};

// Gradient Texture
const gradientCanvas = document.createElement('canvas');
gradientCanvas.width = 256;
gradientCanvas.height = 256;
const gradientContext = gradientCanvas.getContext('2d');
const gradientTexture = new THREE.CanvasTexture(gradientCanvas);

let gradientOffset = 0;

function generateGradientTexture() {
    gradientContext.clearRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    const gradient = gradientContext.createLinearGradient(0, 0, gradientCanvas.width, 0);
    const baseColor = new THREE.Color(params['Base Color']);
    const hsl = {};
    baseColor.getHSL(hsl);

    gradient.addColorStop(0, `hsl(${(hsl.h * 360 + params['Color Hue Offset'] + gradientOffset + 0) % 360}, ${params['Color Saturation']}%, ${params['Color Brightness']}%)`);
    gradient.addColorStop(0.5, `hsl(${(hsl.h * 360 + params['Color Hue Offset'] + gradientOffset + 90) % 360}, ${params['Color Saturation']}%, ${params['Color Brightness']}%)`);
    gradient.addColorStop(1, `hsl(${(hsl.h * 360 + params['Color Hue Offset'] + gradientOffset + 180) % 360}, ${params['Color Saturation']}%, ${params['Color Brightness']}%)`);

    gradientContext.fillStyle = gradient;
    gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    gradientTexture.needsUpdate = true;
}

function resetSphere() {
    // Reset GUI parameters
    for (const key in initialParams) {
        params[key] = initialParams[key];
    }
    gui.updateDisplay();

    // Reset material properties
    material.metalness = initialParams['Metallic Finish'];
    material.roughness = initialParams['Surface Roughness'];
    material.clearcoat = initialParams['Clear Coat Shine'];
    material.displacementScale = initialParams['Shape Intensity'];
    material.map = gradientTexture; // Ensure gradient texture is active
    sphere.material = material; // Ensure the default material is active

    // Reset displacement map to flat
    context.fillStyle = '#000';
    context.fillRect(0, 0, 128, 128);
    displacementMap.needsUpdate = true;

    // Reset gradient offset and regenerate gradient
    gradientOffset = 0;
    generateGradientTexture();
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Sphere
const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.5,
    clearcoat: 0.0,
});
material.map = gradientTexture;
const sphere = new THREE.Mesh(geometry, material);
sphere.name = 'sphere';
scene.add(sphere);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Key Light
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill Light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-5, 5, 5);
scene.add(fillLight);

// Back Light
const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
backLight.position.set(0, 5, -5);
scene.add(backLight);

// Shadow configuration
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
keyLight.shadow.mapSize.width = 2048; // Higher resolution
keyLight.shadow.mapSize.height = 2048; // Higher resolution
sphere.castShadow = true;

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.receiveShadow = true; // Enable shadow receiving
scene.add(ground);

// Post-processing
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
composer.addPass(outlinePass);

// GUI
const gui = new GUI();

// Appearance Folder
const appearanceFolder = gui.addFolder('Appearance');
appearanceFolder.addColor(params, 'Base Color').onChange(() => {
    generateGradientTexture();
});
appearanceFolder.add(params, 'Color Hue Offset', 0, 360).onChange(() => {
    generateGradientTexture();
});
appearanceFolder.add(params, 'Color Saturation', 0, 100).onChange(() => {
    generateGradientTexture();
});
appearanceFolder.add(params, 'Color Brightness', 0, 100).onChange(() => {
    generateGradientTexture();
});
appearanceFolder.add(params, 'Metallic Finish', 0, 1).onChange(() => {
    material.metalness = params['Metallic Finish'];
});
appearanceFolder.add(params, 'Surface Roughness', 0, 1).onChange(() => {
    material.roughness = params['Surface Roughness'];
});
appearanceFolder.add(params, 'Clear Coat Shine', 0, 1).onChange(() => {
    material.clearcoat = params['Clear Coat Shine'];
});
appearanceFolder.add(params, 'texture', ['None', 'Rock', 'Wood', 'Glass']).onChange(() => {
    switch (params.texture) {
        case 'None':
            sphere.material = material;
            material.map = gradientTexture;
            break;
        case 'Rock':
            sphere.material = material;
            material.map = rockTexture;
            break;
        case 'Wood':
            sphere.material = material;
            material.map = woodTexture;
            break;
        case 'Glass':
            sphere.material = glassMaterial;
            break;
    }
    material.needsUpdate = true;
    glassMaterial.needsUpdate = true;
});

// Shape Folder
const shapeFolder = gui.addFolder('Shape');
shapeFolder.add(params, 'Shape Intensity', 0, 1).onChange(() => {
    material.displacementScale = params['Shape Intensity'];
});

// Animation Folder
const animationFolder = gui.addFolder('Animation');
animationFolder.add(params, 'Rotation Speed', 0, 0.1);

// Reset Button
gui.add(params, 'reset');

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

// Displacement Map
const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const context = canvas.getContext('2d');
const displacementMap = new THREE.CanvasTexture(canvas);
material.displacementMap = displacementMap;

function generateTexture() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, 128, 128);

    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const size = Math.random() * 10 + 5;
        context.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        context.fillRect(x, y, size, size);
    }
    displacementMap.needsUpdate = true;
}

function onMouseDown(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && intersects[0].object.name === 'sphere') {
        generateTexture();
    }
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && intersects[0].object.name === 'sphere') {
        if (hoveredObject !== intersects[0].object) {
            hoveredObject = intersects[0].object;
            document.body.style.cursor = 'pointer';
            outlinePass.selectedObjects = [hoveredObject];
        }
    } else {
        if (hoveredObject !== null) {
            hoveredObject = null;
            document.body.style.cursor = 'default';
            outlinePass.selectedObjects = [];
        }
    }
}

window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);

// Animation
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += params['Rotation Speed'];
    sphere.rotation.y += params['Rotation Speed'];
    gradientOffset += 0.5; // Adjust speed of gradient movement
    generateGradientTexture();
    controls.update();
    composer.render();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

animate();