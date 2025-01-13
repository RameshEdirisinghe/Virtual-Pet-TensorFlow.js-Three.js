import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const textureLoader = new THREE.TextureLoader();

const monkeyUrl = new URL('../assets/doggo2.glb', import.meta.url);
const floorUrl = new URL('../assets/floor.jpg', import.meta.url);
const backWallUrl = new URL('../assets/backfloor.jpg', import.meta.url);
const backWallTexture = textureLoader.load(backWallUrl.href);

// const cubeTextureLoader = new THREE.CubeTextureLoader()
// cubeTextureLoader.setPath(new URL('../assets/cubemap/', import.meta.url).href);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);


const floorTexture = textureLoader.load(floorUrl);
floorTexture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.PlaneGeometry( 30, 30 );

const floormaterial = new THREE.MeshBasicMaterial( {map: floorTexture,side: THREE.DoubleSide, } );
const floorplane = new THREE.Mesh( geometry, floormaterial );
floorplane.rotation.x = -0.5 * Math.PI;
scene.add( floorplane );

const wallgeometry = new THREE.PlaneGeometry( 30, 15 );
const backWallmaterial = new THREE.MeshBasicMaterial( { map: backWallTexture, } )
const backwallPlane = new THREE.Mesh( wallgeometry, backWallmaterial );
backwallPlane.rotation.y = 0.5 * Math.PI;
backwallPlane.position.x= -15;
backwallPlane.position.y= 7.5;

scene.add( backwallPlane );

const leftWallmaterial = new THREE.MeshBasicMaterial( { map: backWallTexture, } )
const leftwallPlane = new THREE.Mesh( wallgeometry, leftWallmaterial );
leftwallPlane.rotation.y = 1 * Math.PI;
leftwallPlane.position.z= 15;
leftwallPlane.position.y= 7.5;
scene.add(leftwallPlane);

const rightWallmaterial = new THREE.MeshBasicMaterial( { map: backWallTexture, } )
const rightwallPlane = new THREE.Mesh( wallgeometry, rightWallmaterial );
rightwallPlane.position.z= -15;
rightwallPlane.position.y= 7.5;
scene.add(rightwallPlane);


const cubeTextureLoader = new THREE.CubeTextureLoader();
const backgroundCubemap = cubeTextureLoader.load([
  new URL('../assets/cubemap/px.png', import.meta.url).href,
  new URL('../assets/cubemap/nx.png', import.meta.url).href,
  new URL('../assets/cubemap/py.png', import.meta.url).href,
  new URL('../assets/cubemap/ny.png', import.meta.url).href,
  new URL('../assets/cubemap/pz.png', import.meta.url).href,
  new URL('../assets/cubemap/nz.png', import.meta.url).href
]);

scene.background = backgroundCubemap;



const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});