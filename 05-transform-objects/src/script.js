import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();


const group =  new THREE.Group()
scene.add(group)

/**
 * Objects
 */
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)


const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color:0xff0000})
)

const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xcc0000 })
);
cube2.position.set(2,0,0)
cube1.position.set(-2,0,0)
cube3.position.set(0,-1,0)
group.add(cube1)
group.add(cube2)
group.add(cube3)

// mesh.position.set(0.7, -0.6, 1);


// mesh.scale.set(2, 0.5, 0.5);

// mesh.rotation.reorder('YXZ')
// mesh.rotateY(Math.PI*0.25);
// mesh.rotateX(Math.PI*0.25);

// scene.add(mesh);

//axis helper

const axesHelper = new THREE.AxesHelper(3);

scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
	width: 800,
	height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);


// camera.lookAt(mesh.position);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
