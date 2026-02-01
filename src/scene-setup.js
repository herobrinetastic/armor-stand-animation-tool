// scene-setup.js — final reliable version
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333); // Dark gray background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Final tuned values for clean full-body view (centered on torso)
    camera.position.set(0, 1, 2); // Centered x=0

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 2.1; // prevent going under ground

    // This is the critical line that was missing
    controls.target.set(0, 1, 0); // Centered x=0
    controls.update();

    // Lights
    const dirLight1 = new THREE.DirectionalLight(0xffe0b2, 2.5);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffe0b2, 1.5);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    scene.add(new THREE.AmbientLight(0xffe0b2, 0.8));

    const armorStand = new THREE.Group();
    armorStand.name = 'armorStand'; // Added name for easy cloning
    scene.add(armorStand);

    console.log('✅ Camera initialized → position:', camera.position.toArray(), 'target:', controls.target.toArray());

    return { scene, camera, renderer, controls, armorStand };
}