// src/events.js
export function bindAnimationEvents(animation, pose, applyPose, globalGui) {
  document.getElementById('playing').checked = animation.playing;
  document.getElementById('playing').addEventListener('change', (e) => { 
    animation.playing = e.target.checked; 
    if (animation.playing) {
      animation.currentTime = animation.kfIndex / animation.tempo;
    }
  });

  document.getElementById('tempo').value = animation.tempo;
  document.getElementById('tempo-value').textContent = animation.tempo;
  document.getElementById('tempo').addEventListener('input', (e) => {
    animation.tempo = parseFloat(e.target.value);
    document.getElementById('tempo-value').textContent = animation.tempo.toFixed(1);
  });

  const kfSlider = document.getElementById('kfIndex');
  const kfValue = document.getElementById('kfIndex-value');
  kfSlider.addEventListener('input', (e) => {
    animation.kfIndex = parseInt(e.target.value);
    if (animation.keyframes.length) {
      Object.assign(pose, animation.keyframes[animation.kfIndex]);
      applyPose();
      globalGui.updateDisplay();
    }
    kfValue.textContent = animation.kfIndex;
  });
}