// src/selection.js
import * as THREE from 'three';

let currentlySelected = null;
const originalColors = new Map();

export function initSelection(camera, transformControls, groups, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const objects = Object.values(groups);
  let isDragging = false;

  const onMouseDown = (event) => {
    if (isDragging) return; // Disable selection during drag

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects, true); // Recursive: true to hit meshes in groups

    // Remove previous highlight
    if (currentlySelected) {
      restoreOriginalColor(currentlySelected);
      currentlySelected = null;
    }

    if (intersects.length > 0) {
      const selectedGroup = intersects[0].object.parent;

      if (selectedGroup && selectedGroup.isGroup) {
        currentlySelected = selectedGroup;
        highlightGroup(selectedGroup);
        transformControls.attach(selectedGroup);
      }
    } else {
      transformControls.detach();
    }
  };

  renderer.domElement.addEventListener('mousedown', onMouseDown);

  // Disable selection during gizmo drag
  transformControls.addEventListener('dragging-changed', (event) => {
    isDragging = event.value;
  });

  // Optional: Also remove highlight when user clicks away from gizmo
  transformControls.addEventListener('dragging-changed', (event) => {
    if (!event.value && currentlySelected) {
      restoreOriginalColor(currentlySelected);
      currentlySelected = null;
    }
  });
}

function highlightGroup(group) {
  group.traverse((child) => {
    if (child.isMesh && child.material) {
      if (!originalColors.has(child)) {
        originalColors.set(child, child.material.color.clone());
      }
      child.material.color.set(0xff7777); // Brighter red
    }
  });
}

function restoreOriginalColor(group) {
  group.traverse((child) => {
    if (child.isMesh && child.material && originalColors.has(child)) {
      child.material.color.copy(originalColors.get(child));
    }
  });
}