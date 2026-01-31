// transform-controls.js
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export function initTransformControls(scene, camera, renderer, orbitControls) {
    const tc = new TransformControls(camera, renderer.domElement);
    tc.setMode('rotate');
    tc.setSize(0.5);
    tc.space = 'local';
    tc.addEventListener('dragging-changed', (event) => {
        orbitControls.enabled = !event.value;
    });
    scene.add(tc.getHelper());
    tc._gizmo.traverse((child) => {
        if (child.name === 'E') child.visible = false;
    });
    return tc;
}