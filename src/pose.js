// pose.js
export function addLimbFolder(gui, pose, applyPose, name, xKey, yKey, zKey) {
  const f = gui.addFolder(name);
  f.domElement.querySelector('.title').style.fontWeight = 'bold';
  [xKey, yKey, zKey].forEach(k => {
    f.add(pose, k, -180, 180, 0.1)
     .name(k.replace(/X|Y|Z/, ''))
     .listen()
     .onChange(applyPose);
  });
  f.close();
}