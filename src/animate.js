// src/animate.js
export function startAnimation(renderer, scene, camera, controls, animation, pose, updatePose, gui, updateTimeline) {
  let lastTime = 0;
  function animate(time) {
    requestAnimationFrame(animate);
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    controls.update();
    updateAnimation(animation, pose, updatePose, gui, updateTimeline, delta);
    renderer.render(scene, camera);
  }
  animate(0);
}

function updateAnimation(animation, pose, updatePose, gui, updateTimeline, delta) {
  if (!animation.playing || animation.keyframes.length < 2) return;

  animation.currentTime += delta;

  const frameDuration = 1 / animation.tempo;          // seconds per keyframe
  const totalDuration = animation.keyframes.length * frameDuration;

  const timeMod = animation.currentTime % totalDuration;
  const frameIndex = Math.floor(timeMod / frameDuration);

  const poseData = animation.keyframes[frameIndex];

  animation.kfIndex = frameIndex;
  document.getElementById('kfIndex').value = frameIndex;
  document.getElementById('kfIndex-value').textContent = frameIndex;

  Object.assign(pose, poseData);
  updatePose();
  gui.updateDisplay();
  updateTimeline();
}