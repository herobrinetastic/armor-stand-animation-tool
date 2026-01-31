// script.js
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
const { gui, pose, updatePose, animation, updateVisualizer } = initGUI(groups, scene, camera);

animation.currentTime = 0;

function updateAnimation(delta) {
    if (!animation.playing || animation.keyframes.length < 2) return;

    animation.currentTime += delta;

    const frameDuration = 1 / animation.tempo;          // seconds per keyframe
    const totalDuration = animation.keyframes.length * frameDuration;

    const time = animation.currentTime % totalDuration;
    const frameIndex = Math.floor(time / frameDuration);

    const poseData = animation.keyframes[frameIndex];

    animation.kfIndex = frameIndex;
    document.getElementById('kfIndex').value = frameIndex;
    document.getElementById('kfIndex-value').textContent = frameIndex;

    Object.assign(pose, poseData);
    updatePose();
    gui.updateDisplay();
    updateVisualizer();
}
startAnimation(renderer, scene, camera, controls, updateAnimation);

// Gizmo to GUI sync
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});