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

export function addAnimationFolder(gui, animation, pose, applyPose, globalGui, scene, camera, renderer) {
  // Bind events
  bindAnimationEvents(animation, pose, applyPose, globalGui);

  const kfSlider = document.getElementById('kfIndex');
  const kfValue = document.getElementById('kfIndex-value');

  function refreshKfSlider() {
    kfSlider.max = Math.max(0, animation.keyframes.length - 1);
    kfSlider.value = animation.kfIndex;
    kfValue.textContent = animation.kfIndex;
  }

  animation.showDelayEditor = false;

  const actions = {
    add() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.push({ ...normalizePose(pose), thumbnail, delay: 10 });
      animation.kfIndex = animation.keyframes.length - 1;
      refreshKfSlider();
      updateTimeline();
    },
    insert() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.splice(animation.kfIndex + 1, 0, { ...normalizePose(pose), thumbnail, delay: 10 });
      animation.kfIndex++;
      refreshKfSlider();
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
        refreshKfSlider();
        actions.loadCurrent();
        updateTimeline();
      }
    },
    clear() {
      // Reset pose to default
      Object.keys(pose).forEach(key => pose[key] = 0);
      applyPose();

      // Update sliders to reflect default pose
      const sliders = document.querySelectorAll('#pose-window .rotation');
      sliders.forEach(sl => {
        sl.value = 0;
        sl.nextElementSibling.textContent = '0.0';
      });

      // Capture default thumbnail
      const defaultThumbnail = captureThumbnail(scene, camera, renderer);

      // Reset keyframes to single default
      animation.keyframes = [{ ...normalizePose(pose), thumbnail: defaultThumbnail, delay: 10 }];
      animation.kfIndex = 0;
      animation.currentTime = 0;
      refreshKfSlider();
      updateTimeline();
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
            refreshKfSlider();
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
        sliders.forEach(sl => {
          const part = sl.dataset.part;
          const axis = sl.dataset.axis.toUpperCase();
          sl.value = pose[`${part}${axis}`] || 0;
          sl.nextElementSibling.textContent = parseFloat(sl.value).toFixed(1);
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
  document.getElementById('clear').addEventListener('click', actions.clear);
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
        refreshKfSlider();
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

  return { kfSlider, refreshKfSlider, actions, updateTimeline };
}