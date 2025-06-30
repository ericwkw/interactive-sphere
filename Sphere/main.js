import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GUI } from 'https://unpkg.com/lil-gui@0.19.1/dist/lil-gui.esm.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Shadow configuration
renderer.shadowMap.enabled = true;
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
    rotationSpeed: 0.01
};

gui.addColor(params, 'color').onChange(() => {
    material.color.set(params.color);
});

const textureLoader = new THREE.TextureLoader();
const rockTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
const woodTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');

const rgbeLoader = new RGBELoader();
let envMap;
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    envMap = texture;
});

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
            scene.background = envMap;
            sphere.material.envMap = envMap;
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
