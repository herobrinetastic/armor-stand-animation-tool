// src/utils.js
import * as THREE from 'three';

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
  // Save original settings
  const originalWidth = renderer.domElement.width;
  const originalHeight = renderer.domElement.height;
  const originalAspect = camera.aspect;
  const originalPosition = camera.position.clone();
  const originalRotation = camera.rotation.clone();
  const originalUp = camera.up.clone();
  const originalZoom = camera.zoom;

  // Set to portrait (slimmer, taller)
  const thumbWidth = 200;
  const thumbHeight = 320;
  renderer.setSize(thumbWidth, thumbHeight);
  camera.aspect = thumbWidth / thumbHeight;
  camera.updateProjectionMatrix();

  // Reset to fixed front view: centered on model (x=0, y=1, z=0), looking at center
  camera.position.set(0, 1, 2); // Front view
  camera.lookAt(0, 1, 0); // Target model center
  camera.up.set(0, 1, 0); // Standard up
  camera.zoom = 1; // Reset zoom
  camera.updateProjectionMatrix();

  // Render and capture
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');

  // Restore original
  renderer.setSize(originalWidth, originalHeight);
  camera.aspect = originalAspect;
  camera.position.copy(originalPosition);
  camera.rotation.copy(originalRotation);
  camera.up.copy(originalUp);
  camera.zoom = originalZoom;
  camera.updateProjectionMatrix();

  return dataUrl;
}