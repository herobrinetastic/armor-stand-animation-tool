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
    groups.head.rotation.set(THREE.MathUtils.degToRad(pose.headX), THREE.MathUtils.degToRad(-pose.headY), THREE.MathUtils.degToRad(-pose.headZ));
    groups.body.rotation.set(THREE.MathUtils.degToRad(pose.bodyX), THREE.MathUtils.degToRad(-pose.bodyY), THREE.MathUtils.degToRad(-pose.bodyZ));
    groups.leftArm.rotation.set(THREE.MathUtils.degToRad(pose.leftArmX), THREE.MathUtils.degToRad(-pose.leftArmY), THREE.MathUtils.degToRad(-pose.leftArmZ));
    groups.rightArm.rotation.set(THREE.MathUtils.degToRad(pose.rightArmX), THREE.MathUtils.degToRad(-pose.rightArmY), THREE.MathUtils.degToRad(-pose.rightArmZ));
    groups.leftLeg.rotation.set(THREE.MathUtils.degToRad(pose.leftLegX), THREE.MathUtils.degToRad(-pose.leftLegY), THREE.MathUtils.degToRad(-pose.leftLegZ));
    groups.rightLeg.rotation.set(THREE.MathUtils.degToRad(pose.rightLegX), THREE.MathUtils.degToRad(-pose.rightLegY), THREE.MathUtils.degToRad(-pose.rightLegZ));
  }

  const animation = { playing: false, tempo: 1, keyframes: [], kfIndex: 0, currentTime: 0 };
  const animFolder = addAnimationFolder(null, animation, pose, updatePose, null, scene, camera, renderer); // Removed gui dependency

  // Bind custom sliders
  const sliders = document.querySelectorAll('#pose-window .rotation');
  sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const part = e.target.dataset.part;
      const axis = e.target.dataset.axis;
      pose[`${part}${axis.toUpperCase()}`] = parseFloat(e.target.value);
      updatePose();
      e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(1);
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
        pose[`${part}X`] = degX;
        pose[`${part}Y`] = degY;
        pose[`${part}Z`] = degZ;
        sliders.forEach(sl => {
          if (sl.dataset.part === part) {
            if (sl.dataset.axis === 'x') {
              sl.value = degX;
              sl.nextElementSibling.textContent = degX.toFixed(1);
            }
            if (sl.dataset.axis === 'y') {
              sl.value = degY;
              sl.nextElementSibling.textContent = degY.toFixed(1);
            }
            if (sl.dataset.axis === 'z') {
              sl.value = degZ;
              sl.nextElementSibling.textContent = degZ.toFixed(1);
            }
          }
        });
      }
    }
  });

  return { pose, updatePose, animation, updateTimeline: animFolder.updateTimeline };
}