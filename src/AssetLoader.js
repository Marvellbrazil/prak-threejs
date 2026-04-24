import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AssetLoader {
    constructor() {
        this.loader = new GLTFLoader();
    }
    
    loadModel(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => resolve(gltf.scene),
                (xhr) => {
                    const percent = (xhr.loaded / xhr.total) * 100;
                    console.log(`Loading: ${Math.round(percent)}`);
                },
                (error) => reject(error)
            );
        });
    }
}