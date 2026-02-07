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

function angleLerp(a, b, t) {
  let diff = ((b - a + 180) % 360 - 180);
  return a + diff * t;
}

function lerpPoses(poseA, poseB, t) {
  return {
    headX: angleLerp(poseA.headX, poseB.headX, t),
    headY: angleLerp(poseA.headY, poseB.headY, t),
    headZ: angleLerp(poseA.headZ, poseB.headZ, t),
    bodyX: angleLerp(poseA.bodyX, poseB.bodyX, t),
    bodyY: angleLerp(poseA.bodyY, poseB.bodyY, t),
    bodyZ: angleLerp(poseA.bodyZ, poseB.bodyZ, t),
    leftArmX: angleLerp(poseA.leftArmX, poseB.leftArmX, t),
    leftArmY: angleLerp(poseA.leftArmY, poseB.leftArmY, t),
    leftArmZ: angleLerp(poseA.leftArmZ, poseB.leftArmZ, t),
    rightArmX: angleLerp(poseA.rightArmX, poseB.rightArmX, t),
    rightArmY: angleLerp(poseA.rightArmY, poseB.rightArmY, t),
    rightArmZ: angleLerp(poseA.rightArmZ, poseB.rightArmZ, t),
    leftLegX: angleLerp(poseA.leftLegX, poseB.leftLegX, t),
    leftLegY: angleLerp(poseA.leftLegY, poseB.leftLegY, t),
    leftLegZ: angleLerp(poseA.leftLegZ, poseB.leftLegZ, t),
    rightLegX: angleLerp(poseA.rightLegX, poseB.rightLegX, t),
    rightLegY: angleLerp(poseA.rightLegY, poseB.rightLegY, t),
    rightLegZ: angleLerp(poseA.rightLegZ, poseB.rightLegZ, t),
  };
}

function updateAnimation(animation, pose, updatePose, gui, updateTimeline, delta) {
  if (!animation.playing || animation.keyframes.length < 2) return;

  animation.currentTime += delta * animation.tempo;

  const kfLen = animation.keyframes.length;
  const durations = animation.keyframes.map((_, i) => (animation.keyframes[(i + 1) % kfLen].delay || 10) / 20); // seconds per segment
  const totalDuration = durations.reduce((a, b) => a + b, 0);

  if (totalDuration === 0) return;

  animation.currentTime %= totalDuration;

  let cumulative = 0;
  let prevIndex = 0;
  let fraction = 0;

  for (let i = 0; i < kfLen; i++) {
    const segDur = durations[i];
    if (cumulative + segDur > animation.currentTime) {
      fraction = (animation.currentTime - cumulative) / segDur;
      prevIndex = i;
      break;
    }
    cumulative += segDur;
  }

  const nextIndex = (prevIndex + 1) % kfLen;
  const poseA = animation.keyframes[prevIndex];
  const poseB = animation.keyframes[nextIndex];
  const lerpedPose = lerpPoses(poseA, poseB, fraction);

  animation.kfIndex = prevIndex;

  Object.assign(pose, lerpedPose);
  updatePose();
  if (gui) gui.updateDisplay();
  updateTimeline();

  // Update sliders during animation
  const sliders = document.querySelectorAll('#pose-window .rotation');
  sliders.forEach(sl => {
    const part = sl.dataset.part;
    const axis = sl.dataset.axis.toUpperCase();
    const val = pose[`${part}${axis}`] || 0;
    sl.value = val;
    sl.nextElementSibling.value = val.toFixed(1);
  });
}