// selection.js
import * as THREE from 'three';

export function initSelection(camera, transformControls, groups, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const objects = Object.values(groups);

  renderer.domElement.addEventListener('mousedown', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects, true); // Recursive: true to hit meshes in groups

    if (intersects.length > 0) {
      const selected = intersects[0].object.parent;
      transformControls.attach(selected);
    } else {
      transformControls.detach();
    }
  });
}