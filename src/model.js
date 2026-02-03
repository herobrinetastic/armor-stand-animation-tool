// src/model.js
import * as THREE from 'three';
import { createMesh } from './utils.js';

export async function createArmorStand(armorStand) {
  const texture = new THREE.TextureLoader().load('textures/armor_stand.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Head
  const head = new THREE.Group();
  head.position.set(0, 1.5, 0);
  const headMesh = createMesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
  headMesh.position.set(0, 0.25, 0);
  head.add(headMesh);
  head.rotation.order = 'ZYX';
  armorStand.add(head);

  // Body
  const body = new THREE.Group();
  body.position.set(0, 0.75, 0);
  const bodyMesh = createMesh(new THREE.BoxGeometry(0.5, 0.75, 0.25), material);
  bodyMesh.position.set(0, -0.375, 0);
  body.add(bodyMesh);
  body.rotation.order = 'ZYX';
  armorStand.add(body);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(0.3125, 1.25, 0);
  const leftArmMesh = createMesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), material);
  leftArmMesh.position.set(0.0625, -0.375, 0);
  leftArm.add(leftArmMesh);
  leftArm.rotation.order = 'ZYX';
  armorStand.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.3125, 1.25, 0);
  const rightArmMesh = createMesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), material);
  rightArmMesh.position.set(-0.0625, -0.375, 0);
  rightArm.add(rightArmMesh);
  rightArm.rotation.order = 'ZYX';
  armorStand.add(rightArm);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.125, 0.75, 0);
  const leftLegMesh = createMesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), material);
  leftLegMesh.position.set(0, -0.375, 0);
  leftLeg.add(leftLegMesh);
  leftLeg.rotation.order = 'ZYX';
  armorStand.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.125, 0.75, 0);
  const rightLegMesh = createMesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), material);
  rightLegMesh.position.set(0, -0.375, 0);
  rightLeg.add(rightLegMesh);
  rightLeg.rotation.order = 'ZYX';
  armorStand.add(rightLeg);

  return { head, body, leftArm, rightArm, leftLeg, rightLeg };
}