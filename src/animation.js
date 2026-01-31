// src/animation.js
import { bindAnimationEvents } from './events.js';
import { captureThumbnail } from './utils.js';

export function addAnimationFolder(gui, animation, pose, applyPose, globalGui, scene, camera, renderer) {
  bindAnimationEvents(animation, pose, applyPose, globalGui);

  const kfSlider = document.getElementById('kfIndex');
  const kfValue = document.getElementById('kfIndex-value');

  function refreshKfSlider() {
    kfSlider.max = Math.max(0, animation.keyframes.length - 1);
    kfSlider.value = animation.kfIndex;
    kfValue.textContent = animation.kfIndex;
  }

  const actions = {
    add() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.push({ ...pose, thumbnail });
      animation.kfIndex = animation.keyframes.length - 1;
      refreshKfSlider();
      updateTimeline();
    },
    insert() {
      const thumbnail = captureThumbnail(scene, camera, renderer);
      animation.keyframes.splice(animation.kfIndex + 1, 0, { ...pose, thumbnail });
      animation.kfIndex++;
      refreshKfSlider();
      updateTimeline();
    },
    save() {
      if (animation.keyframes.length) {
        const thumbnail = captureThumbnail(scene, camera, renderer);
        animation.keyframes[animation.kfIndex] = { ...pose, thumbnail };
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
      animation.keyframes = [];
      animation.kfIndex = 0;
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
            animation.keyframes = d.keyframes ?? [];
            animation.keyframes.forEach(kf => {
              if (!kf.thumbnail) {
                Object.assign(pose, kf);
                applyPose();
                kf.thumbnail = captureThumbnail(scene, camera, renderer);
              }
            });
            animation.kfIndex = 0;
            refreshKfSlider();
            actions.loadCurrent();
            globalGui.updateDisplay();
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
        globalGui.updateDisplay();
      }
    }
  };

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
      const img = document.createElement('img');
      img.src = kf.thumbnail || '';
      img.onclick = () => {
        animation.kfIndex = i;
        refreshKfSlider();
        actions.loadCurrent();
        updateTimeline();  // Re-render to highlight new active
      };
      if (i === animation.kfIndex) img.classList.add('active');
      timeline.appendChild(img);
    });
  };

  return { kfSlider, refreshKfSlider, actions, updateTimeline };
}