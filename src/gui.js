// src/gui.js
import * as THREE from 'three';
import { addAnimationFolder } from './animation.js';

export function initGUI(groups, scene, camera, transformControls, renderer) {
  const pose = {
    headX: 0, headY: 0, headZ: 0,
    bodyX: 0, bodyY: 0, bodyZ: 0,
    leftArmX: 0, leftArmY: 0, leftArmZ: 0,
    rightArmX: 0, rightArmY: 0, rightArmZ: 0,
    leftLegX: 0, leftLegY: 0, leftLegZ: 0,
    rightLegX: 0, rightLegY: 0, rightLegZ: 0,
  };

  // Apply current pose values to the actual Three.js groups
  const applyPose = () => {
    groups.head.rotation.set(
      THREE.MathUtils.degToRad(pose.headX),
      THREE.MathUtils.degToRad(pose.headY),
      THREE.MathUtils.degToRad(pose.headZ)
    );
    groups.body.rotation.set(
      THREE.MathUtils.degToRad(pose.bodyX),
      THREE.MathUtils.degToRad(pose.bodyY),
      THREE.MathUtils.degToRad(pose.bodyZ)
    );
    groups.leftArm.rotation.set(
      THREE.MathUtils.degToRad(pose.leftArmX),
      THREE.MathUtils.degToRad(pose.leftArmY),
      THREE.MathUtils.degToRad(pose.leftArmZ)
    );
    groups.rightArm.rotation.set(
      THREE.MathUtils.degToRad(pose.rightArmX),
      THREE.MathUtils.degToRad(pose.rightArmY),
      THREE.MathUtils.degToRad(pose.rightArmZ)
    );
    groups.leftLeg.rotation.set(
      THREE.MathUtils.degToRad(pose.leftLegX),
      THREE.MathUtils.degToRad(pose.leftLegY),
      THREE.MathUtils.degToRad(pose.leftLegZ)
    );
    groups.rightLeg.rotation.set(
      THREE.MathUtils.degToRad(pose.rightLegX),
      THREE.MathUtils.degToRad(pose.rightLegY),
      THREE.MathUtils.degToRad(pose.rightLegZ)
    );
  };

  const updatePose = () => {
    applyPose();
  };

  // Slider + number input handling
  const sliders = document.querySelectorAll('#pose-window .rotation');
  sliders.forEach(sl => {
    const part = sl.dataset.part;
    const axis = sl.dataset.axis.toUpperCase();
    const numberInput = sl.nextElementSibling;

    sl.addEventListener('input', () => {
      const val = parseFloat(sl.value);
      pose[`${part}${axis}`] = val;
      numberInput.value = val.toFixed(1);
      updatePose();
    });

    numberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        let newVal = parseFloat(numberInput.value);
        if (!isNaN(newVal)) {
          newVal = Math.max(-180, Math.min(180, newVal));
          pose[`${part}${axis}`] = newVal;
          sl.value = newVal;
          numberInput.value = newVal.toFixed(1);
          updatePose();
        }
      }
    });
  });

  // Sword checkbox
  const showSwordCheckbox = document.getElementById('show-sword');
  if (groups.sword) {
    showSwordCheckbox.checked = false;
    groups.sword.visible = false;

    showSwordCheckbox.addEventListener('change', () => {
      groups.sword.visible = showSwordCheckbox.checked;
    });
  }

  const animation = {
    keyframes: [],
    kfIndex: 0,
    tempo: 5,
    playing: false,
    showDelayEditor: false,
    currentTime: 0,
  };

  const { actions, updateTimeline } = addAnimationFolder(animation, pose, applyPose, scene, camera, renderer);

  return { pose, updatePose, animation, updateTimeline };
}