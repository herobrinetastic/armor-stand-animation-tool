// src/animate.js
export function startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, gui, updateVisualizer) {
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    updateAnimation(animation, pose, updatePose, gui, updateVisualizer); // Call moved function
    renderer.render(scene, camera);
  }
  animate();
}

function updateAnimation(animation, pose, updatePose, gui, updateVisualizer) { // Moved from script.js
  if (!animation.playing || animation.keyframes.length < 2) return;

  animation.currentTime += 1 / 60; // Approximate delta (use better timing if needed)

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