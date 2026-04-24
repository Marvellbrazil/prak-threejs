import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class UIManager {
    constructor(container) {
        this.renderer = new CSS2DRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.style.position = 'absolute';
        this.renderer.style.top = '0px';
        this.renderer.style.pointerEvents = 'none';
        container.appendChild(this.renderer.domElement);
    }

    createTextLabel(text, position, className = 'label-3d') {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        return div;
    }

    createCSS2DObject(div, position) {
        const label = new CSS2DObject(div);
        label.position.copy(position);
        return label;
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}