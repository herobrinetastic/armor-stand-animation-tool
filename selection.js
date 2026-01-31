// selection.js
import * as THREE from 'three';

export function initSelection(camera, transformControls, groups) {
    const selectableGroups = Object.values(groups);
    let selectedLimb = null;
    function highlight(group) {
        group.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.emissive.set(0xff0000);
                child.material.emissiveIntensity = 0.5;
            }
        });
    }
    function unhighlight(group) {
        group.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.emissive.set(0x000000);
                child.material.emissiveIntensity = 0;
            }
        });
    }
    function selectLimb(group) {
        if (selectedLimb) {
            unhighlight(selectedLimb);
            transformControls.detach();
        }
        selectedLimb = group;
        highlight(group);
        transformControls.attach(group);
    }
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onPointerDown(event) {
        if (transformControls.dragging) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(selectableGroups, true);
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj && !selectableGroups.includes(obj)) {
                obj = obj.parent;
            }
            if (obj) {
                selectLimb(obj);
            }
        } else {
            if (selectedLimb) {
                unhighlight(selectedLimb);
                transformControls.detach();
                selectedLimb = null;
            }
        }
    }
    document.addEventListener('pointerdown', onPointerDown);
}