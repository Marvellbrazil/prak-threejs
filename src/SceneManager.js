import * as THREE from 'three';

export class SceneManager {
    constructor(canvas) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.cssLabelContainer = document.createElement('div');
        this.cssLabelContainer.id = 'css-labels';
        document.body.appendChild(this.cssLabelContainer);
    }
    
    add(object) {
        this.scene.add(object);
    }
    
    addCSSLabel(text, position) {
        const div = document.createElement('div');
        div.className = 'label-3d label-title';
        div.textContent = text;
        div.style.position = 'absolute';
        this.cssLabelContainer.appendChild(div);
        
        this._cssLabels = this._cssLabels || [];
        this._cssLabels.push({ element: div, position });
    }
    
    _updateCSSLabels() {
        if (!this._cssLabels) return;
        
        for (const label of this._cssLabels) {
            const pos = label.position.clone();
            pos.project(this.camera);
            
            const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
            
            label.element.style.left = x + 'px';
            label.element.style.top = y + 'px';
            label.element.style.transform = 'translate(-50%, -50%)';
            label.element.style.display = pos.z < 1 ? 'block' : 'none';
        }
    }
    
    animate(callback) {
        const loop = () => {
            if (callback) callback();
            this._updateCSSLabels();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(loop);
        };
        loop();
    }
    
    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}