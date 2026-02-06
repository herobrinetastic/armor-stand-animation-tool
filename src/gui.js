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
    rightLegX: 0, rightLegY: 0, rightLegZ: 0
  };

  function updatePose() {
    groups.headGroup.rotation.set(THREE.MathUtils.degToRad(pose.headX), THREE.MathUtils.degToRad(-pose.headY), THREE.MathUtils.degToRad(-pose.headZ));
    groups.bodyGroup.rotation.set(THREE.MathUtils.degToRad(pose.bodyX), THREE.MathUtils.degToRad(-pose.bodyY), THREE.MathUtils.degToRad(-pose.bodyZ));
    groups.leftArmGroup.rotation.set(THREE.MathUtils.degToRad(pose.leftArmX), THREE.MathUtils.degToRad(-pose.leftArmY), THREE.MathUtils.degToRad(-pose.leftArmZ));
    groups.rightArmGroup.rotation.set(THREE.MathUtils.degToRad(pose.rightArmX), THREE.MathUtils.degToRad(-pose.rightArmY), THREE.MathUtils.degToRad(-pose.rightArmZ));
    groups.leftLegGroup.rotation.set(THREE.MathUtils.degToRad(pose.leftLegX), THREE.MathUtils.degToRad(-pose.leftLegY), THREE.MathUtils.degToRad(-pose.leftLegZ));
    groups.rightLegGroup.rotation.set(THREE.MathUtils.degToRad(pose.rightLegX), THREE.MathUtils.degToRad(-pose.rightLegY), THREE.MathUtils.degToRad(-pose.rightLegZ));
  }

  const animation = { playing: false, tempo: 1, keyframes: [], kfIndex: 0, currentTime: 0, showDelayEditor: false };
  const animFolder = addAnimationFolder(animation, pose, updatePose, scene, camera, renderer);

  // Bind custom sliders
  const sliders = document.querySelectorAll('#pose-window .rotation');
  const numberInputs = document.querySelectorAll('#pose-window .rotation-value');
  sliders.forEach((slider, index) => {
    slider.addEventListener('input', (e) => {
      const part = e.target.dataset.part;
      const axis = e.target.dataset.axis.toUpperCase();
      const val = parseInt(e.target.value, 10);
      pose[`${part}${axis}`] = val;
      updatePose();
      numberInputs[index].value = val;
    });
  });

  numberInputs.forEach((input, index) => {
    input.addEventListener('change', (e) => {
      const part = sliders[index].dataset.part;
      const axis = sliders[index].dataset.axis.toUpperCase();
      let val = parseInt(e.target.value, 10);
      val = isNaN(val) ? 0 : Math.max(-180, Math.min(180, val));
      pose[`${part}${axis}`] = val;
      updatePose();
      sliders[index].value = val;
      e.target.value = val;
    });
  });

  // Gizmo sync
  transformControls.addEventListener('objectChange', () => {
    if (transformControls.object) {
      const group = transformControls.object;
      const rot = group.rotation;
      const degX = THREE.MathUtils.radToDeg(rot.x);
      const degY = -THREE.MathUtils.radToDeg(rot.y);
      const degZ = -THREE.MathUtils.radToDeg(rot.z);
      let part;
      switch (group.name) {
        case 'head': part = 'head'; break;
        case 'body': part = 'body'; break;
        case 'leftArm': part = 'leftArm'; break;
        case 'rightArm': part = 'rightArm'; break;
        case 'leftLeg': part = 'leftLeg'; break;
        case 'rightLeg': part = 'rightLeg'; break;
      }
      if (part) {
        const x = Math.round(degX);
        const y = Math.round(degY);
        const z = Math.round(degZ);
        pose[`${part}X`] = x;
        pose[`${part}Y`] = y;
        pose[`${part}Z`] = z;
        sliders.forEach((sl, idx) => {
          if (sl.dataset.part === part) {
            if (sl.dataset.axis === 'x') {
              sl.value = x;
              numberInputs[idx].value = x;
            }
            if (sl.dataset.axis === 'y') {
              sl.value = y;
              numberInputs[idx].value = y;
            }
            if (sl.dataset.axis === 'z') {
              sl.value = z;
              numberInputs[idx].value = z;
            }
          }
        });
      }
    }
  });

  return { pose, updatePose, animation, updateTimeline: animFolder.updateTimeline };
}