// gui.js
import * as THREE from 'three';
import { addLimbFolder } from './pose.js';
import { addAnimationFolder } from './animation.js';
import { createVisualizer } from './visualizer.js';

export function initGUI(groups, scene, camera) {
  const gui = new dat.GUI({ width: 320 });
  gui.domElement.style.fontSize = '13px';
  gui.domElement.style.userSelect = 'none';

  const pose = {
    headX:0, headY:0, headZ:0, bodyX:0, bodyY:0, bodyZ:0,
    leftArmX:0, leftArmY:0, leftArmZ:0,
    rightArmX:0, rightArmY:0, rightArmZ:0,
    leftLegX:0, leftLegY:0, leftLegZ:0,
    rightLegX:0, rightLegY:0, rightLegZ:0
  };

  const animation = {
    playing: false, tempo: 1, keyframes: [], kfIndex: 0
  };

  function applyPose() {
    const parts = [
      ['headGroup','headX','headY','headZ'],
      ['bodyGroup','bodyX','bodyY','bodyZ'],
      ['leftArmGroup','leftArmX','leftArmY','leftArmZ'],
      ['rightArmGroup','rightArmX','rightArmY','rightArmZ'],
      ['leftLegGroup','leftLegX','leftLegY','leftLegZ'],
      ['rightLegGroup','rightLegX','rightLegY','rightLegZ']
    ];
    parts.forEach(([g,x,y,z]) => groups[g].rotation.set(
      THREE.MathUtils.degToRad(pose[x]),
      THREE.MathUtils.degToRad(pose[y]),
      THREE.MathUtils.degToRad(pose[z]), 'XYZ'
    ));
  }

  // 1. Limbs
  addLimbFolder(gui, pose, applyPose, 'Head',      'headX',     'headY',     'headZ');
  addLimbFolder(gui, pose, applyPose, 'Body',      'bodyX',     'bodyY',     'bodyZ');
  addLimbFolder(gui, pose, applyPose, 'Left Arm',  'leftArmX',  'leftArmY',  'leftArmZ');
  addLimbFolder(gui, pose, applyPose, 'Right Arm', 'rightArmX', 'rightArmY', 'rightArmZ');
  addLimbFolder(gui, pose, applyPose, 'Left Leg',  'leftLegX',  'leftLegY',  'leftLegZ');
  addLimbFolder(gui, pose, applyPose, 'Right Leg', 'rightLegX', 'rightLegY', 'rightLegZ');

  // 2. Animation folder (with placeholder updateVisualizer)
  const { kfSlider, refreshKfSlider, actions } = addAnimationFolder(gui, animation, pose, applyPose, gui, () => {});

  // 3. Visualizer (now actions exist)
  const { updateVisualizer } = createVisualizer(animation, actions, refreshKfSlider, scene, camera, pose, applyPose);

  // 4. Inject real updateVisualizer into actions
  ['add','insert','save','delete','clear','loadFile'].forEach(method => {
    const original = actions[method];
    actions[method] = function(...args) {
      original.apply(this, args);
      updateVisualizer();
    };
  });

  // Export button
  gui.add({
    export() {
      const f = n => Number(n).toFixed(3);
      const cmd = `/summon armor_stand ~ ~ ~ {ShowArms:1b,Pose:{Head:[${f(pose.headX)}f,${f(pose.headY)}f,${f(pose.headZ)}f],Body:[${f(pose.bodyX)}f,${f(pose.bodyY)}f,${f(pose.bodyZ)}f],LeftArm:[${f(pose.leftArmX)}f,${f(pose.leftArmY)}f,${f(pose.leftArmZ)}f],RightArm:[${f(pose.rightArmX)}f,${f(pose.rightArmY)}f,${f(pose.rightArmZ)}f],LeftLeg:[${f(pose.leftLegX)}f,${f(pose.leftLegY)}f,${f(pose.leftLegZ)}f],RightLeg:[${f(pose.rightLegX)}f,${f(pose.rightLegY)}f,${f(pose.rightLegZ)}f]}}`;
      navigator.clipboard.writeText(cmd).then(() => alert(cmd));
    }
  }, 'export').name('Export /copy');

  // Add default keyframe
  animation.keyframes.push({ ...pose });
  animation.kfIndex = 0;
  refreshKfSlider();
  updateVisualizer();

  applyPose();
  return { gui, pose, updatePose: applyPose, animation, updateVisualizer };
}