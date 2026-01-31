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

  // Drag window
  const window = document.getElementById('animation-window');
  const header = window.querySelector('.header');
  header.addEventListener('mousedown', (e) => {
    let shiftX = e.clientX - window.getBoundingClientRect().left;
    let shiftY = e.clientY - window.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
      window.style.left = pageX - shiftX + 'px';
      window.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), {once: true});
  });
  header.style.cursor = 'move';

  // Close button
  document.getElementById('close-btn').addEventListener('click', () => window.style.display = 'none');
}