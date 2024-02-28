import * as THREE from 'three';
import MapBuilder from "./mapBuilder.ts";

class Engine {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    canvas: HTMLCanvasElement;

    mapBuilder: MapBuilder;

    interval: number | null = null;
    iterationNumber: number = 0;

    constructor(width: number, height: number, scale: number = 25) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.initCamera(width, height);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.canvas = document.body.appendChild(this.renderer.domElement);

        this.mapBuilder = new MapBuilder(width, height, scale);
        this.initTimer();
    }

    initCamera(width: number, height: number) {
        if(!this.camera) return;
        this.camera.position.x = width / 2;
        this.camera.position.y = -height / 2;
        this.camera.position.z = 500;

        this.camera.rotateX(0.7);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    addToScene(meshes: THREE.Object3D[]) {
        meshes.forEach(mesh => this.scene.add(mesh));
    }

    start() {
        this.animate();
    }

    initTimer() {
        if(!this.interval) {
            this.interval = setInterval(() => {
                this.iterationNumber++;
                this.scene.clear();
                const meshes = this.mapBuilder.buildMap(this.iterationNumber);
                this.addToScene(meshes);
            }, 100);
        }
    }

}

export default Engine;