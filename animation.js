// animation.js
export function addAnimationFolder(gui, animation, pose, applyPose, globalGui, updateVisualizer) {
  const anim = gui.addFolder('Animation');
  anim.add(animation, 'playing').name('Play / Pause').listen();
  anim.add(animation, 'tempo', 0.1, 10, 0.1).name('Speed (fps)');
  
  const kfSlider = anim.add(animation, 'kfIndex', 0, 0, 1)
                      .name('Keyframe')
                      .listen()
                      .onChange(() => {
                        if (animation.keyframes.length) {
                          Object.assign(pose, animation.keyframes[animation.kfIndex]);
                          applyPose();
                          globalGui.updateDisplay();
                        }
                      });

  function refreshKfSlider() {
    kfSlider.min(0).max(Math.max(0, animation.keyframes.length-1)).updateDisplay();
  }

  const actions = {
    add() {
      animation.keyframes.push({ ...pose });
      animation.kfIndex = animation.keyframes.length - 1;
      refreshKfSlider();
      updateVisualizer();
    },
    insert() {
      animation.keyframes.splice(animation.kfIndex + 1, 0, { ...pose });
      animation.kfIndex++;
      refreshKfSlider();
      updateVisualizer();
    },
    save() {
      if (animation.keyframes.length) {
        animation.keyframes[animation.kfIndex] = { ...pose };
        updateVisualizer();
      }
    },
    delete() {
      if (animation.keyframes.length > 1) {
        animation.keyframes.splice(animation.kfIndex, 1);
        animation.kfIndex = Math.min(animation.kfIndex, animation.keyframes.length - 1);
        refreshKfSlider();
        actions.loadCurrent();
        updateVisualizer();
      }
    },
    clear() {
      animation.keyframes = [];
      animation.kfIndex = 0;
      refreshKfSlider();
      updateVisualizer();
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
            updateVisualizer();
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

  anim.add(actions, 'add').name('+ Add');
  anim.add(actions, 'insert').name('↳ Insert');
  anim.add(actions, 'save').name('Save current');
  anim.add(actions, 'delete').name('− Delete');
  anim.add(actions, 'clear').name('Clear all');
  anim.add(actions, 'saveFile').name('↓ Save .json');
  anim.add(actions, 'loadFile').name('↑ Load .json');

  return { anim, kfSlider, refreshKfSlider, actions };
}