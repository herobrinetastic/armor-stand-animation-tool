// src/animation.js
import { bindAnimationEvents } from './events.js';
import { captureThumbnail } from './utils.js';

function normalizePose(pose) {
  const normalized = { ...pose };
  for (let key in normalized) {
    if (key !== 'thumbnail' && key !== 'delay') {
      let deg = normalized[key];
      deg = ((deg % 360) + 360) % 360;
      if (deg > 180) deg -= 360;
      normalized[key] = deg;
    }
  }
  return normalized;
}

export function addAnimationFolder(animation, pose, applyPose, scene, camera, renderer) {

  const actions = {
    add() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.push({ ...normalizePose(pose), thumbnail, delay: 10 });
      animation.kfIndex = animation.keyframes.length - 1;
      updateTimeline();
    },
    insert() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.splice(animation.kfIndex + 1, 0, { ...normalizePose(pose), thumbnail, delay: 10 });
      animation.kfIndex++;
      updateTimeline();
    },
    save() {
      if (animation.keyframes.length) {
        const thumbnail = captureThumbnail(scene, camera, renderer);
        animation.keyframes[animation.kfIndex] = { ...animation.keyframes[animation.kfIndex], ...normalizePose(pose), thumbnail };
        updateTimeline();
      }
    },
    delete() {
      if (animation.keyframes.length > 1) {
        animation.keyframes.splice(animation.kfIndex, 1);
        animation.kfIndex = Math.min(animation.kfIndex, animation.keyframes.length - 1);
        actions.loadCurrent();
        updateTimeline();
      }
    },
    saveFile() {
      const data = JSON.stringify({ tempo: animation.tempo, keyframes: animation.keyframes }, null, 2);
      const blob = new Blob([data], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'armorstand_anim.json'; a.click();
      URL.revokeObjectURL(url);
    },
    loadFile() {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json';
      inp.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const r = new FileReader();
        r.onload = ev => {
          try {
            const d = JSON.parse(ev.target.result);
            animation.tempo = d.tempo ?? 1;
            document.getElementById('tempo').value = animation.tempo;
            document.getElementById('tempo-value').textContent = animation.tempo.toFixed(1);
            animation.keyframes = (d.keyframes ?? []).map(kf => {
              let normKf = normalizePose(kf);
              if (!kf.thumbnail) {
                Object.assign(pose, normKf);
                applyPose();
                normKf.thumbnail = captureThumbnail(scene, camera, renderer);
              } else {
                normKf.thumbnail = kf.thumbnail;
              }
              normKf.delay = kf.delay || 10;
              return normKf;
            });
            animation.kfIndex = 0;
            animation.currentTime = 0;
            actions.loadCurrent();
            updateTimeline();
          } catch {
            alert('Invalid file');
          }
        };
        r.readAsText(file);
      };
      inp.click();
    },
    loadCurrent() {
      if (animation.keyframes.length) {
        Object.assign(pose, animation.keyframes[animation.kfIndex]);
        applyPose();
        const sliders = document.querySelectorAll('.rotation');
        const numberInputs = document.querySelectorAll('.rotation-value');
        sliders.forEach((sl, idx) => {
          const part = sl.dataset.part;
          const axis = sl.dataset.axis.toUpperCase();
          const val = pose[`${part}${axis}`] || 0;
          sl.value = val;
          sl.nextElementSibling.textContent = val.toFixed(1);
        });
        // Set currentTime to start of this keyframe
        const durations = animation.keyframes.map(kf => (kf.delay || 10) / 20);
        animation.currentTime = durations.slice(0, animation.kfIndex).reduce((a, b) => a + b, 0);
      }
    }
  };

  // Bind buttons
  document.getElementById('add').addEventListener('click', actions.add);
  document.getElementById('insert').addEventListener('click', actions.insert);
  document.getElementById('save').addEventListener('click', actions.save);
  document.getElementById('delete').addEventListener('click', actions.delete);
  document.getElementById('saveFile').addEventListener('click', actions.saveFile);
  document.getElementById('loadFile').addEventListener('click', actions.loadFile);

  const updateTimeline = () => {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    animation.keyframes.forEach((kf, i) => {
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';

      const img = document.createElement('img');
      img.src = kf.thumbnail || '';
      img.onclick = (e) => {
        e.stopPropagation();
        animation.kfIndex = i;
        animation.showDelayEditor = true;
        actions.loadCurrent();
        updateTimeline();  // Re-render to highlight new active and show editor
      };
      if (i === animation.kfIndex) img.classList.add('active');
      container.appendChild(img);

      if (i === animation.kfIndex && !animation.playing && animation.showDelayEditor) {
        const editor = document.createElement('div');
        editor.className = 'kf-delay-editor';
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.value = kf.delay || 10;
        input.addEventListener('input', (e) => {
          animation.keyframes[i].delay = parseInt(e.target.value) || 10;
        });
        input.addEventListener('click', (e) => e.stopPropagation());
        editor.appendChild(input);
        container.appendChild(editor);
        container.addEventListener('click', (e) => e.stopPropagation());
      }

      timeline.appendChild(container);
    });
  };

  document.addEventListener('click', () => {
    if (animation.showDelayEditor) {
      animation.showDelayEditor = false;
      updateTimeline();
    }
  });

  bindAnimationEvents(animation, pose, applyPose, {actions, updateTimeline});

  return { actions, updateTimeline };
}