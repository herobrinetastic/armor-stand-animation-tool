// src/utils.js
import * as THREE from 'three';
import { unhighlightCurrent, rehighlightCurrent } from './selection.js';

export function createMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material.clone());
  const uv = geometry.attributes.uv.array;
  const dx = geometry.parameters.width;
  const dy = geometry.parameters.height;
  const dz = geometry.parameters.depth;
  const scales = [{u:dz,v:dy},{u:dz,v:dy},{u:dx,v:dz},{u:dx,v:dz},{u:dx,v:dy},{u:dx,v:dy}];
  for (let f = 0; f < 6; f++) {
    const start = f * 8;
    const us = scales[f].u;
    const vs = scales[f].v;
    for (let i = 0; i < 8; i += 2) {
      uv[start + i] *= us;
      uv[start + i + 1] *= vs;
    }
  }
  geometry.attributes.uv.needsUpdate = true;
  return mesh;
}

export function captureThumbnail(scene, camera, renderer) {
  unhighlightCurrent();

  const originalWidth = renderer.domElement.width;
  const originalHeight = renderer.domElement.height;

  // Portrait dimensions
  const thumbWidth = 200;
  const thumbHeight = 320;

  // Temporarily resize renderer for high-quality thumbnail
  renderer.setSize(thumbWidth, thumbHeight, false); // false = don't update CSS size

  // Create a temporary camera
  const tempCamera = new THREE.PerspectiveCamera(50, thumbWidth / thumbHeight, 0.1, 1000);
  tempCamera.position.set(0, 1, 3); // Zoomed out
  tempCamera.lookAt(0, 1, 0); // Centered target
  tempCamera.up.set(0, 1, 0);
  tempCamera.updateProjectionMatrix();

  // Create temp scene with dark gray background
  const tempScene = new THREE.Scene();
  tempScene.background = new THREE.Color(0x333333);

  // Clone armorStand and add to temp scene
  const armorStandClone = scene.getObjectByName('armorStand').clone(); // Assuming armorStand.name = 'armorStand'; add if not
  tempScene.add(armorStandClone);

  // Clone lights from original scene
  scene.traverse((child) => {
    if (child.isLight) {
      tempScene.add(child.clone());
    }
  });

  // Render once with temp scene and camera
  renderer.render(tempScene, tempCamera);

  const dataUrl = renderer.domElement.toDataURL('image/png');

  // Restore original renderer size
  renderer.setSize(originalWidth, originalHeight, false);

  rehighlightCurrent();

  return dataUrl;
}