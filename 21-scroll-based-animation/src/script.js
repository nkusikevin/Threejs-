import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from 'gsap'

//textures

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/gradients/3.jpg");
texture.magFilter = THREE.NearestFilter;

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
	materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
	material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * objects
 */

const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: texture,
});

const ObjectDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16),
	material
);

mesh1.position.y = -ObjectDistance * 0;
mesh2.position.y = -ObjectDistance * 1;
mesh3.position.y = -ObjectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshs = [mesh1, mesh2, mesh3];

//Particles

const count = 2000;

const position = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
	position[i * 3 + 0] = (Math.random() - 0.5) * 10;
	position[i * 3 + 1] =
		ObjectDistance * 0.5 - Math.random() * ObjectDistance * 3;
	position[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particleGeo = new THREE.BufferGeometry();

particleGeo.setAttribute("position", new THREE.BufferAttribute(position, 3));

const particlesMaterial = new THREE.PointsMaterial({
	color: 0xffffff,
	sizeAttenuation: true,
	size: 0.03,
});

const points = new THREE.Points(particleGeo, particlesMaterial);

scene.add(points);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrollY = window.scrollY;
let currentSection = 0
window.addEventListener("scroll", () => {
	scrollY = window.scrollY;
    const newSection = Math.round(scrollY/sizes.height)

if(newSection != currentSection){
    currentSection = newSection
    gsap.to(
        sectionMeshs[currentSection].rotation,
        {
            duration:1.5,
            ease: "power2.inOut",
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        }
    )
}


});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;


const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	//Animate Meshs
	for (const mesh of sectionMeshs) {
		mesh.rotation.x += deltaTime * 0.1;
		mesh.rotation.y += deltaTime * 0.12;
	}

	//Animate Camera
	camera.position.y = (-scrollY / sizes.height) * ObjectDistance;

	const parallax = cursor.x;
	const parallaxY = -cursor.y;

	cameraGroup.position.x += (parallax - cameraGroup.position.x) * 5 * deltaTime;
	cameraGroup.position.y +=
		(parallaxY - cameraGroup.position.y) * 5 * deltaTime;

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
