// src/script.js
import * as THREE from 'three';
import { initScene } from './scene-setup.js';
import { initTransformControls } from './transform-controls.js';
import { createArmorStand } from './model.js';
import { initSelection } from './selection.js';
import { initGUI } from './gui.js';
import { startAnimation } from './animate.js';
import { captureThumbnail } from './utils.js';

const { scene, camera, renderer, controls, armorStand } = initScene();
const transformControls = initTransformControls(scene, camera, renderer, controls);
const groups = await createArmorStand(armorStand); // Await async textures
initSelection(camera, transformControls, groups);
const { gui, pose, updatePose, animation, updateTimeline } = initGUI(groups, scene, camera, transformControls, renderer);

animation.currentTime = 0;

startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, gui, updateTimeline);

// Add default keyframe after textures and first render
requestAnimationFrame(() => {
  const defaultThumbnail = captureThumbnail(scene, camera, renderer);
  animation.keyframes.push({ ...pose, thumbnail: defaultThumbnail });
  animation.kfIndex = 0;
  const kfSlider = document.getElementById('kfIndex');
  kfSlider.max = Math.max(0, animation.keyframes.length - 1);
  kfSlider.value = animation.kfIndex;
  document.getElementById('kfIndex-value').textContent = animation.kfIndex;
  updateTimeline();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});