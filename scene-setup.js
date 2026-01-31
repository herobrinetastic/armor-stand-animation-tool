// scene-setup.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    const scene = new THREE.Scene();
    const texture = new THREE.TextureLoader().load('./minecraft_skybox.webp');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, color: 0x9E9D9D });
    const skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(1, 1, 3);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    const dirLight1 = new THREE.DirectionalLight(0xffe0b2, 2.5);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffe0b2, 1.5);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);
    scene.add(new THREE.AmbientLight(0xffe0b2, 0.8));
    const armorStand = new THREE.Group();
    scene.add(armorStand);
    return { scene, camera, renderer, controls, armorStand };
}