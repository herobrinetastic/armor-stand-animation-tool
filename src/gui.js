// src/gui.js
import * as THREE from 'three';
import { addAnimationFolder } from './animation.js';

export function initGUI(groups, scene, camera, transformControls, renderer) {
  const gui = new dat.GUI({ width: 320 });
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top = '60px';
  gui.domElement.style.left = '10px';

  const pose = {
    headX: 0, headY: 0, headZ: 0,
    bodyX: 0, bodyY: 0, bodyZ: 0,
    leftArmX: 0, leftArmY: 0, leftArmZ: 0,
    rightArmX: 0, rightArmY: 0, rightArmZ: 0,
    leftLegX: 0, leftLegY: 0, leftLegZ: 0,
    rightLegX: 0, rightLegY: 0, rightLegZ: 0,
    showArms: true,
    noBasePlate: false,
    small: false,
    invisible: false,
    customNameVisible: false,
    noGravity: false,
    marker: false
  };

  function updatePose() {
    groups.headGroup.rotation.set(THREE.MathUtils.degToRad(pose.headX), THREE.MathUtils.degToRad(pose.headY), THREE.MathUtils.degToRad(pose.headZ));
    groups.bodyGroup.rotation.set(THREE.MathUtils.degToRad(pose.bodyX), THREE.MathUtils.degToRad(pose.bodyY), THREE.MathUtils.degToRad(pose.bodyZ));
    groups.leftArmGroup.rotation.set(THREE.MathUtils.degToRad(pose.leftArmX), THREE.MathUtils.degToRad(pose.leftArmY), THREE.MathUtils.degToRad(pose.leftArmZ));
    groups.rightArmGroup.rotation.set(THREE.MathUtils.degToRad(pose.rightArmX), THREE.MathUtils.degToRad(pose.rightArmY), THREE.MathUtils.degToRad(pose.rightArmZ));
    groups.leftLegGroup.rotation.set(THREE.MathUtils.degToRad(pose.leftLegX), THREE.MathUtils.degToRad(pose.leftLegY), THREE.MathUtils.degToRad(pose.leftLegZ));
    groups.rightLegGroup.rotation.set(THREE.MathUtils.degToRad(pose.rightLegX), THREE.MathUtils.degToRad(pose.rightLegY), THREE.MathUtils.degToRad(pose.rightLegZ));
  }

  // Pose folders (original logic)
  const headFolder = gui.addFolder('Head');
  headFolder.add(pose, 'headX', -180, 180, 0.1).onChange(updatePose);
  headFolder.add(pose, 'headY', -180, 180, 0.1).onChange(updatePose);
  headFolder.add(pose, 'headZ', -180, 180, 0.1).onChange(updatePose);

  const bodyFolder = gui.addFolder('Body');
  bodyFolder.add(pose, 'bodyX', -180, 180, 0.1).onChange(updatePose);
  bodyFolder.add(pose, 'bodyY', -180, 180, 0.1).onChange(updatePose);
  bodyFolder.add(pose, 'bodyZ', -180, 180, 0.1).onChange(updatePose);

  const leftArmFolder = gui.addFolder('Left Arm');
  leftArmFolder.add(pose, 'leftArmX', -180, 180, 0.1).onChange(updatePose);
  leftArmFolder.add(pose, 'leftArmY', -180, 180, 0.1).onChange(updatePose);
  leftArmFolder.add(pose, 'leftArmZ', -180, 180, 0.1).onChange(updatePose);

  const rightArmFolder = gui.addFolder('Right Arm');
  rightArmFolder.add(pose, 'rightArmX', -180, 180, 0.1).onChange(updatePose);
  rightArmFolder.add(pose, 'rightArmY', -180, 180, 0.1).onChange(updatePose);
  rightArmFolder.add(pose, 'rightArmZ', -180, 180, 0.1).onChange(updatePose);

  const leftLegFolder = gui.addFolder('Left Leg');
  leftLegFolder.add(pose, 'leftLegX', -180, 180, 0.1).onChange(updatePose);
  leftLegFolder.add(pose, 'leftLegY', -180, 180, 0.1).onChange(updatePose);
  leftLegFolder.add(pose, 'leftLegZ', -180, 180, 0.1).onChange(updatePose);

  const rightLegFolder = gui.addFolder('Right Leg');
  rightLegFolder.add(pose, 'rightLegX', -180, 180, 0.1).onChange(updatePose);
  rightLegFolder.add(pose, 'rightLegY', -180, 180, 0.1).onChange(updatePose);
  rightLegFolder.add(pose, 'rightLegZ', -180, 180, 0.1).onChange(updatePose);

  const propertiesFolder = gui.addFolder('Properties');
  propertiesFolder.add(pose, 'showArms');
  propertiesFolder.add(pose, 'noBasePlate');
  propertiesFolder.add(pose, 'small');
  propertiesFolder.add(pose, 'invisible');
  propertiesFolder.add(pose, 'customNameVisible');
  propertiesFolder.add(pose, 'noGravity');
  propertiesFolder.add(pose, 'marker');

  const animation = { playing: false, tempo: 1, keyframes: [], kfIndex: 0, currentTime: 0 };
  const animFolder = addAnimationFolder(gui, animation, pose, updatePose, gui, scene, camera, renderer);

  // Toggle logic (moved from script.js)
  gui.hide();
  const togglePoseBtn = document.getElementById('toggle-pose-btn');
  let poseVisible = false;
  togglePoseBtn.addEventListener('click', () => {
    poseVisible = !poseVisible;
    if (poseVisible) {
      gui.show();
      togglePoseBtn.textContent = 'Hide Posing Controls';
    } else {
      gui.hide();
      togglePoseBtn.textContent = 'Posing Controls';
    }
  });

  // Gizmo sync (moved from script.js)
  transformControls.addEventListener('objectChange', () => {
    if (transformControls.object) {
      const group = transformControls.object;
      const rot = group.rotation;
      const degX = THREE.MathUtils.radToDeg(rot.x);
      const degY = THREE.MathUtils.radToDeg(rot.y);
      const degZ = THREE.MathUtils.radToDeg(rot.z);
      switch (group.name) {
        case 'headGroup': pose.headX = degX; pose.headY = degY; pose.headZ = degZ; break;
        case 'bodyGroup': pose.bodyX = degX; pose.bodyY = degY; pose.bodyZ = degZ; break;
        case 'leftArmGroup': pose.leftArmX = degX; pose.leftArmY = degY; pose.leftArmZ = degZ; break;
        case 'rightArmGroup': pose.rightArmX = degX; pose.rightArmY = degY; pose.rightArmZ = degZ; break;
        case 'leftLegGroup': pose.leftLegX = degX; pose.leftLegY = degY; pose.leftLegZ = degZ; break;
        case 'rightLegGroup': pose.rightLegX = degX; pose.rightLegY = degY; pose.rightLegZ = degZ; break;
      }
      gui.updateDisplay();
    }
  });

  animFolder.updateTimeline();

  return { gui, pose, updatePose, animation, updateTimeline: animFolder.updateTimeline };
}