import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/lil-gui@0.19.1/dist/lil-gui.esm.js';

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
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.5,
    clearcoat: 0.0,
});
const sphere = new THREE.Mesh(geometry, material);
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

// GUI
const gui = new GUI();
const params = {
    color: 0xffffff,
    texture: 'None',
    rotationSpeed: 0.01,
    metalness: 0.0,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 1.0,
    thickness: 0.5
};

gui.addColor(params, 'color').onChange(() => {
    material.color.set(params.color);
});

gui.add(params, 'metalness', 0, 1).onChange(() => {
    material.metalness = params.metalness;
});

gui.add(params, 'roughness', 0, 1).onChange(() => {
    material.roughness = params.roughness;
});

gui.add(params, 'clearcoat', 0, 1).onChange(() => {
    material.clearcoat = params.clearcoat;
});

const textureLoader = new THREE.TextureLoader();
const rockTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
const woodTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');

const glassMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 1,
    thickness: 0.5
});

gui.add(params, 'texture', ['None', 'Rock', 'Wood', 'Glass']).onChange(() => {
    switch (params.texture) {
        case 'None':
            sphere.material = material;
            material.map = null;
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

gui.add(params, 'rotationSpeed', 0, 0.1);

// Animation
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += params.rotationSpeed;
    sphere.rotation.y += params.rotationSpeed;
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
