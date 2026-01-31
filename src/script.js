// src/script.js
import * as THREE from 'three';
import { initScene } from './scene-setup.js';
import { initTransformControls } from './transform-controls.js';
import { createArmorStand } from './model.js';
import { initSelection } from './selection.js';
import { initGUI } from './gui.js';
import { startAnimation } from './animate.js';

const { scene, camera, renderer, controls, armorStand } = initScene();
const transformControls = initTransformControls(scene, camera, renderer, controls);
const groups = createArmorStand(armorStand);
initSelection(camera, transformControls, groups);
const { gui, pose, updatePose, animation, updateVisualizer } = initGUI(groups, scene, camera, transformControls); // Pass transformControls for gizmo sync

animation.currentTime = 0;

startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, gui, updateVisualizer);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});