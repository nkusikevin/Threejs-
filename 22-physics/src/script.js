import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

debugObject.createSphere = () => {
	createSphere(Math.random() * 0.5, {
		x: (Math.random() - 0.5) * 3,
		y: 3,
		z: (Math.random() - 0.5) * 3,
	});
};

debugObject.createBox = () => {
	createBoxes(Math.random(), Math.random(), Math.random(), {
		x: (Math.random() - 0.5) * 0.3,
		y: 3,
		z: (Math.random() - 0.5) * 3,
	});
};

gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = () => {
	hitSound.currentTime = 0;
	hitSound.play();
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
	"/textures/environmentMaps/0/px.png",
	"/textures/environmentMaps/0/nx.png",
	"/textures/environmentMaps/0/py.png",
	"/textures/environmentMaps/0/ny.png",
	"/textures/environmentMaps/0/pz.png",
	"/textures/environmentMaps/0/nz.png",
]);

//world
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.8, 0);

const concreteMaterial = new CANNON.Material("concrete");
const defaultMaterial = new CANNON.Material("default");
const plasticMaterial = new CANNON.Material("plastic");

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
	concreteMaterial,
	plasticMaterial,
	{
		friction: 0.1,
		restitution: 0.8,
	}
);

world.addContactMaterial(concretePlasticContactMaterial);

//sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const body = new CANNON.Body({
// 	mass: 1,
// 	position: new CANNON.Vec3(0, 3, 0),
// 	shape: sphereShape,
// 	material: plasticMaterial,
// });
// body.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0));
// world.addBody(body);

//floor

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// floorBody.material = concreteMaterial;
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
// 	new THREE.SphereGeometry(0.5, 32, 32),
// 	new THREE.MeshStandardMaterial({
// 		metalness: 0.3,
// 		roughness: 0.4,
// 		envMap: environmentMapTexture,
// 		envMapIntensity: 0.5,
// 	})
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: "#777777",
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Three.js mesh
const objectsToUpdate = [];

const SphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});

//create sphere
const createSphere = (radius, position) => {
	const mesh = new THREE.Mesh(SphereGeometry, sphereMaterial);
	mesh.scale.set(radius, radius, radius);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);

	//Cannon.js body
	const shape = new CANNON.Sphere(radius);
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});

	body.position.copy(position);

	world.addBody(body);

	objectsToUpdate.push({
		mesh,
		body,
	});
};

//create boxes

const createBoxes = (width, height, depth, position) => {
	const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
	mesh.scale.set(width, height, depth);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);

	//cannon body
	const shape = new CANNON.Box(
		new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
	);
	const body = new CANNON.Body({
		mass: 2,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});

	body.position.copy(position);
	body.addEventListener("collide", playHitSound);

	world.addBody(body);

	objectsToUpdate.push({
		mesh,
		body,
	});
};

createSphere(0.5, new CANNON.Vec3(0, 3, 0));

/**
 * Animate
 */
const clock = new THREE.Clock();

let lastElapsedTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - lastElapsedTime;
	lastElapsedTime = elapsedTime;

	// body.applyForce(new CANNON.Vec3(-0.5, 0, 0), body.position);

	for (const object of objectsToUpdate) {
		object.mesh.position.copy(object.body.position);
		object.mesh.quaternion.copy(object.body.quaternion);
	}

	// Update controls
	controls.update();

	//update physics world

	world.step(1 / 6, deltaTime, 3);
	// sphere.position.copy(body.position);

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
