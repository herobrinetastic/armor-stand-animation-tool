// src/model.js
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

        // Body Group
        const body = new THREE.Group();
        body.name = 'body';
        body.position.set(0, neckY, 0);
        body.rotation.order = 'ZYX';
        armorStand.add(body);

        geometry = new THREE.BoxGeometry(12*s, 3*s, 3*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 22.5*s - neckY, 0);
        body.add(mesh);

        geometry = new THREE.BoxGeometry(2*s, 7*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(-2*s, 17.5*s - neckY, 0);
        body.add(mesh);

        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(2*s, 17.5*s - neckY, 0);
        body.add(mesh);

        geometry = new THREE.BoxGeometry(8*s, 2*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 13*s - neckY, 0);
        body.add(mesh);

        // Head
        const head = new THREE.Group();
        head.name = 'head';
        head.position.set(0, neckY, 0);
        head.rotation.order = 'ZYX';
        armorStand.add(head);

        geometry = new THREE.BoxGeometry(2*s, 7*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 27.5*s - neckY, 0);
        head.add(mesh);

        // Left Arm
        const leftArm = new THREE.Group();
        leftArm.name = 'leftArm';
        leftArm.position.set(shoulderX, neckY, 0);
        leftArm.rotation.order = 'ZYX';
        armorStand.add(leftArm);

        geometry = new THREE.BoxGeometry(2*s, 12*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 18*s - shoulderY, 0);
        leftArm.add(mesh);

        // Right Arm + Sword
        const rightArm = new THREE.Group();
        rightArm.name = 'rightArm';
        rightArm.position.set(-shoulderX, neckY, 0);
        rightArm.rotation.order = 'ZYX';
        armorStand.add(rightArm);

        geometry = new THREE.BoxGeometry(2*s, 12*s, 2*s);
        mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
        mesh.position.set(0, 18*s - shoulderY, 0);
        rightArm.add(mesh);

        // === IRON SWORD ===
        loader.load('assets/textures/iron_sword.png', (swordTexture) => {
          swordTexture.magFilter = THREE.NearestFilter;
          swordTexture.minFilter = THREE.NearestFilter;

          const swordGeo = new THREE.PlaneGeometry(0.42, 1.85);
          const swordMat = new THREE.MeshPhongMaterial({
            map: swordTexture,
            transparent: true,
            side: THREE.DoubleSide,
            shininess: 5
          });

          const sword = new THREE.Mesh(swordGeo, swordMat);
          
          // Minecraft-style default hold pose
          sword.position.set(0.18, -0.48, 0.12);
          sword.rotation.set(
            THREE.MathUtils.degToRad(-98),
            THREE.MathUtils.degToRad(18),
            THREE.MathUtils.degToRad(22)
          );
          
          sword.visible = false;                    // Not visible by default
          rightArm.add(sword);

          // Legs (unchanged)
          const leftLeg = new THREE.Group();
          leftLeg.name = 'leftLeg';
          leftLeg.position.set(2*s, hipY, 0);
          leftLeg.rotation.order = 'ZYX';
          armorStand.add(leftLeg);

          geometry = new THREE.BoxGeometry(2*s, 11*s, 2*s);
          mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
          mesh.position.set(0, 6.5*s - hipY, 0);
          leftLeg.add(mesh);

          const rightLeg = new THREE.Group();
          rightLeg.name = 'rightLeg';
          rightLeg.position.set(-2*s, hipY, 0);
          rightLeg.rotation.order = 'ZYX';
          armorStand.add(rightLeg);

          geometry = new THREE.BoxGeometry(2*s, 11*s, 2*s);
          mesh = createMesh(geometry, new THREE.MeshPhongMaterial({ map: woodTexture, shininess: 30 }));
          mesh.position.set(0, 6.5*s - hipY, 0);
          rightLeg.add(mesh);

          resolve({ head, body, leftArm, rightArm, leftLeg, rightLeg, sword });
        });
      });
    });
  });
}