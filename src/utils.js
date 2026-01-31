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