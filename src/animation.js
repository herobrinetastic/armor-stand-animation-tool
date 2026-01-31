// src/animation.js
import { bindAnimationEvents } from './events.js';

export function addAnimationFolder(gui, animation, pose, applyPose, globalGui, updateVisualizer) {
  // Bind events
  bindAnimationEvents(animation, pose, applyPose, globalGui, updateVisualizer);

  const kfSlider = document.getElementById('kfIndex');
  const kfValue = document.getElementById('kfIndex-value');

  function refreshKfSlider() {
    kfSlider.max = Math.max(0, animation.keyframes.length - 1);
    kfSlider.value = animation.kfIndex;
    kfValue.textContent = animation.kfIndex;
  }

  const actions = {
    add() {
      animation.keyframes.push({ ...pose });
      animation.kfIndex = animation.keyframes.length - 1;
      refreshKfSlider();
    },
    insert() {
      animation.keyframes.splice(animation.kfIndex + 1, 0, { ...pose });
      animation.kfIndex++;
      refreshKfSlider();
    },
    save() {
      if (animation.keyframes.length) {
        animation.keyframes[animation.kfIndex] = { ...pose };
      }
    },
    delete() {
      if (animation.keyframes.length > 1) {
        animation.keyframes.splice(animation.kfIndex, 1);
        animation.kfIndex = Math.min(animation.kfIndex, animation.keyframes.length - 1);
        refreshKfSlider();
        actions.loadCurrent();
      }
    },
    clear() {
      animation.keyframes = [];
      animation.kfIndex = 0;
      refreshKfSlider();
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
            animation.kfIndex = 0;
            refreshKfSlider();
            actions.loadCurrent();
            globalGui.updateDisplay();
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

  // Bind buttons
  document.getElementById('add').addEventListener('click', actions.add);
  document.getElementById('insert').addEventListener('click', actions.insert);
  document.getElementById('save').addEventListener('click', actions.save);
  document.getElementById('delete').addEventListener('click', actions.delete);
  document.getElementById('clear').addEventListener('click', actions.clear);
  document.getElementById('saveFile').addEventListener('click', actions.saveFile);
  document.getElementById('loadFile').addEventListener('click', actions.loadFile);

  return { kfSlider, refreshKfSlider, actions };
}