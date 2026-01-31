// animate.js
import * as THREE from 'three';

export function startAnimation(renderer, scene, camera, controls, updateCallback = null) {
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (updateCallback) updateCallback(delta);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}