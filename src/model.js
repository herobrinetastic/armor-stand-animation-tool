// src/model.js - exact original four-stick body visual + independent body rotation
import * as THREE from 'three';
import { createMesh } from './utils.js';

export function createArmorStand(armorStand) {
  const s = 1 / 16;
  const hipY = 12 * s;
  const neckY = 24 * s;
  const shoulderY = 24 * s;
  const shoulderX = 6 * s;

  const loader = new THREE.TextureLoader();

  return new Promise((resolve) => {
    loader.load('assets/textures/oak_planks.png', (woodTexture) => {
      woodTexture.magFilter = THREE.NearestFilter;
      woodTexture.minFilter = THREE.NearestFilter;

      loader.load('assets/textures/smooth_stone.png', (stoneTexture) => {
        stoneTexture.magFilter = THREE.NearestFilter;
        stoneTexture.minFilter = THREE.NearestFilter;

        // Baseplate
        let geometry = new THREE.BoxGeometry(12*s, 1*s, 12*s);
        let mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: stoneTexture, shininess: 10 }));
        mesh.position.set(0, 0.5*s, 0);
        armorStand.add(mesh);

        // Body Group - contains the original four meshes (your desired look)
        const bodyGroup = new THREE.Group();
        bodyGroup.name = 'bodyGroup';
        bodyGroup.position.set(0, neckY, 0);
        armorStand.add(bodyGroup);

        // 1. Wide upper plank
        geometry = new THREE.BoxGeometry(12*s, 3*s, 3*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 22.5*s - neckY, 0);
        bodyGroup.add(mesh);

        // 2. Left vertical stick
        geometry = new THREE.BoxGeometry(2*s, 7*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(-2*s, 17.5*s - neckY, 0);
        bodyGroup.add(mesh);

        // 3. Right vertical stick
        geometry = new THREE.BoxGeometry(2*s, 7*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(2*s, 17.5*s - neckY, 0);
        bodyGroup.add(mesh);

        // 4. Lower horizontal plank
        geometry = new THREE.BoxGeometry(8*s, 2*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 13*s - neckY, 0);
        bodyGroup.add(mesh);

        // Head - attached directly to armorStand (independent)
        const headGroup = new THREE.Group();
        headGroup.name = 'headGroup';
        headGroup.position.set(0, neckY, 0);
        armorStand.add(headGroup);

        geometry = new THREE.BoxGeometry(2*s, 7*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 27.5*s - neckY, 0);
        headGroup.add(mesh);

        // Arms - attached directly to armorStand (independent)
        const leftArmGroup = new THREE.Group();
        leftArmGroup.name = 'leftArmGroup';
        leftArmGroup.position.set(shoulderX, neckY, 0);
        armorStand.add(leftArmGroup);

        geometry = new THREE.BoxGeometry(2*s, 12*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 18*s - shoulderY, 0);
        leftArmGroup.add(mesh);

        const rightArmGroup = new THREE.Group();
        rightArmGroup.name = 'rightArmGroup';
        rightArmGroup.position.set(-shoulderX, neckY, 0);
        armorStand.add(rightArmGroup);

        geometry = new THREE.BoxGeometry(2*s, 12*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 18*s - shoulderY, 0);
        rightArmGroup.add(mesh);

        // Legs - attached directly to armorStand
        const leftLegGroup = new THREE.Group();
        leftLegGroup.name = 'leftLegGroup';
        leftLegGroup.position.set(2*s, hipY, 0);
        armorStand.add(leftLegGroup);

        geometry = new THREE.BoxGeometry(2*s, 11*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 6.5*s - hipY, 0);
        leftLegGroup.add(mesh);

        const rightLegGroup = new THREE.Group();
        rightLegGroup.name = 'rightLegGroup';
        rightLegGroup.position.set(-2*s, hipY, 0);
        armorStand.add(rightLegGroup);

        geometry = new THREE.BoxGeometry(2*s, 11*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 6.5*s - hipY, 0);
        rightLegGroup.add(mesh);

        resolve({ bodyGroup, headGroup, leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup });
      });
    });
  });
}