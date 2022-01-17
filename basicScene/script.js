const scene = new THREE.Scene();
const canvas = document.querySelector('.webgl');
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const mesh = new THREE.Mesh(geometry, material);


scene.add(mesh);
const sizes = {
    width:800,
    height:600
}

//camera have three parameters 1.field of view, 2.aspect ratio, 3.near and far plane
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 1;
scene.add(camera);


const renderer = new THREE.WebGLRenderer({
    canvas
});


renderer.setSize(sizes.width,sizes.height);


renderer.render(scene,camera);