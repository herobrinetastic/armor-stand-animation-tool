// src/script.js
import * as THREE from 'three';
import { initScene } from './scene-setup.js';
import { initTransformControls } from './transform-controls.js';
import { createArmorStand } from './model.js';
import { initSelection } from './selection.js';
import { initGUI } from './gui.js';
import { startAnimation } from './animate.js';
import { captureThumbnail } from './utils.js';

const container = document.getElementById('model-container');
const { scene, camera, renderer, controls, armorStand } = initScene();
container.appendChild(renderer.domElement);

// Initial size to container
renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

const transformControls = initTransformControls(scene, camera, renderer, controls);
createArmorStand(armorStand).then(groups => {
  initSelection(camera, transformControls, groups, renderer); // Passed renderer

  const { pose, updatePose, animation, updateTimeline } = initGUI(groups, scene, camera, transformControls, renderer);

  animation.currentTime = 0;

  startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, null, updateTimeline);

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

  // Reset button listener
  document.getElementById('reset-pose-btn').addEventListener('click', () => {
    pose.headX = 0; pose.headY = 0; pose.headZ = 0;
    pose.bodyX = 0; pose.bodyY = 0; pose.bodyZ = 0;
    pose.leftArmX = 0; pose.leftArmY = 0; pose.leftArmZ = 0;
    pose.rightArmX = 0; pose.rightArmY = 0; pose.rightArmZ = 0;
    pose.leftLegX = 0; pose.leftLegY = 0; pose.leftLegZ = 0;
    pose.rightLegX = 0; pose.rightLegY = 0; pose.rightLegZ = 0;
    updatePose();
    const sliders = document.querySelectorAll('#pose-window .rotation');
    sliders.forEach(sl => sl.value = 0);
  });

  // Play/pause button listener
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playingCheckbox = document.getElementById('playing');

  function updatePlayPauseIcon() {
    playPauseBtn.textContent = playingCheckbox.checked ? '⏸' : '▶';
  }

  playPauseBtn.addEventListener('click', () => {
    playingCheckbox.checked = !playingCheckbox.checked;
    playingCheckbox.dispatchEvent(new Event('change'));
    updatePlayPauseIcon();
  });

  playingCheckbox.addEventListener('change', updatePlayPauseIcon);
  updatePlayPauseIcon(); // Initial state
});

window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});