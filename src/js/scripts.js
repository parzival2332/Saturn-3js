import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';
import Saturn from '../img/8k_saturn.jpg';
import Ring from '../img/8k_saturn_ring.png';
import Sun from '../img/8k_sun.jpg';
import Moon from '../img/moon.jpg';
import Moon1 from '../img/moon1.jpg';
import Moon2 from '../img/moon2.jpg';
import Moon3 from '../img/moon3.jpg';
import Front from '../img/front.png';
import Back from '../img/back.png';
import Left from '../img/left.png';
import Right from '../img/right.png';
import Top from '../img/top.png';
import Bottom from '../img/bottom.png';
import Asteroid from '../img/asteroid.jpg';


const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 500);
scene.add(directionalLight);

// Create a sun-like point light
const sunLight = new THREE.PointLight(0xffffff, 1.5, 200); // Increase distance for better illumination
sunLight.position.set(0, 0, 500); // Position the light at the sun's location
scene.add(sunLight);

const sideLight = new THREE.DirectionalLight(0xffffff, 0.5); // Adjust intensity as needed
sideLight.position.set(10, 5, 0); // Position the light on the side
scene.add(sideLight);

// Enable shadow casting for the light
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;

// const axesHelper = new THREE.AxesHelper(5);
// // scene.add(axesHelper);

//code to create sun
const sunGeometry = new THREE.SphereGeometry(20,100,100);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(Sun)
});
const sun= new THREE.Mesh(sunGeometry,sunMaterial);
scene.add(sun);
sun.position.set(0,0,500);
sun.castShadow = false;

// Create Saturn sphere
const saturnGeometry = new THREE.SphereGeometry(1, 32, 32); // radius, widthSegments, heightSegments
const saturnMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(Saturn)});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// Create Saturn's ring
const ringGeometry = new THREE.RingGeometry(1.3, 2, 32); // innerRadius, outerRadius, thetaSegments
const ringMaterial = new THREE.MeshStandardMaterial({ 
    side: THREE.DoubleSide,
    map: textureLoader.load(Ring)
}); 
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2; // Rotate the ring to be horizontal
saturn.add(ring); // Add the ring as a child of the Saturn sphere

// Create moons
const moonGeometry = new THREE.SphereGeometry(0.1, 16, 16); // radius, widthSegments, heightSegments

const moon1Material = new THREE.MeshStandardMaterial({ map: textureLoader.load(Moon) }); // Light gray color
const moon2Material = new THREE.MeshStandardMaterial({ map: textureLoader.load(Moon1) }); // Another shade of gray
const moon3Material = new THREE.MeshStandardMaterial({ map: textureLoader.load(Moon2) }); // Yet another shade of gray
const moon4Material = new THREE.MeshStandardMaterial({ map: textureLoader.load(Moon3) }); // Another shade of gray

const moon1 = new THREE.Mesh(moonGeometry, moon1Material);
const moon2 = new THREE.Mesh(moonGeometry, moon2Material);
const moon3 = new THREE.Mesh(moonGeometry, moon3Material);
const moon4 = new THREE.Mesh(moonGeometry, moon4Material);

scene.add(moon1, moon2, moon3, moon4); // Add moons to the scene

// Set initial positions and rotation speeds for moons
const moon1OrbitRadius = 2.5;
const moon2OrbitRadius = 2.8;
const moon3OrbitRadius = 2.2;
const moon4OrbitRadius = 2.7;

const moon1RotationSpeed = 0.0005;
const moon2RotationSpeed = 0.0003;
const moon3RotationSpeed = 0.0007;
const moon4RotationSpeed = 0.0002;

// Set up shadow casting for necessary objects
saturn.castShadow = true;
moon1.castShadow = true;
moon2.castShadow = true;
moon3.castShadow = true;
moon4.castShadow = true;

// Set up shadow receiving for necessary objects
saturn.receiveShadow = true;
moon1.receiveShadow = true;
moon2.receiveShadow = true;
moon3.receiveShadow = true;
moon4.receiveShadow = true;
ring.receiveShadow = true;


// scene.background = textureLoader.load(Space);
//creating skybox 
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    Right,   
    Left,   
    Top,     
    Bottom, 
    Front,   
    Back    
]);

function createAsteroid(texture) {
    const asteroidGeometry = new THREE.SphereGeometry(0.2, 20, 20);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
        map: texture,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    asteroid.position.set(
        Math.random() * 1000 - 50, 
        Math.random() * 20 - 10,  
        Math.random() * 100 - 50  
    );

    const scale = Math.random() * 0.5 + 0.3; 
    asteroid.scale.set(scale, scale, scale);

    return asteroid;
}

// Create a group to hold the asteroid particles
const particleCount = 50;
const particles = new THREE.Group();
for (let i = 0; i < particleCount; i++) {
    const asteroidTexture = textureLoader.load(Asteroid);
    const particleAsteroid = createAsteroid(asteroidTexture);

    particles.add(particleAsteroid);
}
scene.add(particles);



function animate(time) {
    requestAnimationFrame(animate);

    // Update moon positions
    moon1.position.x = Math.cos(time * moon1RotationSpeed) * moon1OrbitRadius;
    moon1.position.z = Math.sin(time * moon1RotationSpeed) * moon1OrbitRadius;

    moon2.position.x = Math.cos(time * moon2RotationSpeed) * moon2OrbitRadius;
    moon2.position.z = Math.sin(time * moon2RotationSpeed) * moon2OrbitRadius;

    moon3.position.x = Math.cos(time * moon3RotationSpeed) * moon3OrbitRadius;
    moon3.position.z = Math.sin(time * moon3RotationSpeed) * moon3OrbitRadius;

    moon4.position.x = Math.cos(time * moon4RotationSpeed) * moon4OrbitRadius;
    moon4.position.z = Math.sin(time * moon4RotationSpeed) * moon4OrbitRadius;

    particles.rotation.x = time / 10000;
    particles.rotation.y = time / 10000;

    saturn.rotation.y = -time / 10000; // Rotate the Saturn sphere

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
