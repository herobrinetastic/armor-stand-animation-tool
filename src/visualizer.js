// visualizer.js — fallback camera props
import * as THREE from 'three';

export function createVisualizer(animation, actions, refreshKfSlider, scene, camera, pose, applyPose) {
  const timeline = document.createElement('div');
  timeline.style = 'position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.8); padding: 5px; border-radius: 5px; overflow-x: auto; white-space: nowrap; max-width: 80vw;';
  document.body.appendChild(timeline);

  function updateVisualizer() {
    timeline.innerHTML = '';
    animation.keyframes.forEach((kf, i) => {
      const thumb = document.createElement('img');
      thumb.style = 'width: 50px; height: 80px; margin: 2px; border: ' + (i === animation.kfIndex ? '2px solid red' : '1px solid gray') + '; cursor: pointer;';
      thumb.onclick = () => {
        animation.kfIndex = i;
        actions.loadCurrent();
        refreshKfSlider();
        updateVisualizer();
      };
      timeline.appendChild(thumb);
      generateThumbnail(kf, thumb);
    });
  }

  const thumbRenderer = new THREE.WebGLRenderer({ alpha: true });
  thumbRenderer.setSize(50, 80);
  const thumbCamera = new THREE.PerspectiveCamera(camera ? camera.fov : 75, 50/80, camera ? camera.near : 0.1, camera ? camera.far : 1000);
  thumbCamera.position.set(0, 1, 2.5);
  thumbCamera.lookAt(0, 1, 0);

  function generateThumbnail(kfPose, imgElem) {
    if (!scene) return; // Skip if scene undefined
    const tempPose = { ...pose };
    Object.assign(pose, kfPose);
    applyPose();
    thumbRenderer.render(scene, thumbCamera);
    imgElem.src = thumbRenderer.domElement.toDataURL();
    Object.assign(pose, tempPose);
    applyPose();
  }

  return { timeline, updateVisualizer, generateThumbnail };
}