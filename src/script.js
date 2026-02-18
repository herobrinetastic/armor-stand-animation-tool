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

// Set initial size
// Set initial size
renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

const transformControls = initTransformControls(scene, camera, renderer, controls);


createArmorStand(armorStand).then(groups => {
  initSelection(camera, transformControls, groups, renderer);

  // Initialize GUI (now includes sword checkbox handling)
  const { pose, updatePose, animation, updateTimeline, syncUI } = initGUI(
    groups, 
    scene, 
    camera, 
    transformControls, 
    renderer
  );

  transformControls.addEventListener('objectChange', () => {
    const object = transformControls.object;
    if (!object) return;
    const part = object.name;

    function normalizeAngle(deg) {
      deg = ((deg % 360) + 360) % 360;
      if (deg > 180) deg -= 360;
      return deg;
    }

    pose[`${part}X`] = normalizeAngle(THREE.MathUtils.radToDeg(object.rotation.x));
    pose[`${part}Y`] = normalizeAngle(THREE.MathUtils.radToDeg(object.rotation.y));
    pose[`${part}Z`] = normalizeAngle(THREE.MathUtils.radToDeg(object.rotation.z));

    syncUI();
  });

  animation.currentTime = 0;

  startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, updateTimeline);

  // Add default keyframe after textures load and first render
  // Add default keyframe after textures load and first render
  requestAnimationFrame(() => {
    const defaultThumbnail = captureThumbnail(scene, camera, renderer);
    animation.keyframes.push({ ...pose, thumbnail: defaultThumbnail });
    animation.kfIndex = 0;
    updateTimeline();
  });

  // Reset Pose button
  // Reset Pose button
  document.getElementById('reset-pose-btn').addEventListener('click', () => {
    pose.headX = 0; pose.headY = 0; pose.headZ = 0;
    pose.bodyX = 0; pose.bodyY = 0; pose.bodyZ = 0;
    pose.leftArmX = 0; pose.leftArmY = 0; pose.leftArmZ = 0;
    pose.rightArmX = 0; pose.rightArmY = 0; pose.rightArmZ = 0;
    pose.leftLegX = 0; pose.leftLegY = 0; pose.leftLegZ = 0;
    pose.rightLegX = 0; pose.rightLegY = 0; pose.rightLegZ = 0;


    updatePose();

    // Reset all sliders and number inputs

    // Reset all sliders and number inputs
    const sliders = document.querySelectorAll('#pose-window .rotation');
    sliders.forEach(sl => {
      sl.value = 0;
      sl.nextElementSibling.value = '0.0';
    });
  });

  // Play/Pause button
  // Play/Pause button
  const playPauseBtn = document.getElementById('play-pause-btn');

  function updatePlayPauseIcon() {
    playPauseBtn.textContent = animation.playing ? '⏸️' : '▶️';
  }

  playPauseBtn.addEventListener('click', () => {
    animation.playing = !animation.playing;
    if (animation.playing) {
      transformControls.detach();
    }
    updatePlayPauseIcon();
  });

  updatePlayPauseIcon(); // Initial icon
  updatePlayPauseIcon(); // Initial icon
});

window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});