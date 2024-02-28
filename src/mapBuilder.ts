import * as THREE from 'three';
import PerlinNoise from './perlinNoise';

class MapBuilder {

    width: number;
    height: number;
    scale: number;

    heightMap: number[][] = [];

    perlinNoise: PerlinNoise;

    constructor(width: number, height: number, scale: number = 10) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.perlinNoise = new PerlinNoise();
    }

    buildTriangle(vertex1: THREE.Vector3, vertex2: THREE.Vector3, vertex3: THREE.Vector3) {
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints([vertex1, vertex2, vertex3]);

        const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

        return new THREE.Line(geometry, material);
    }

    buildMap(iterationNumber: number) {
        this.initHeightMap(iterationNumber * 0.1);
        const meshes: THREE.Object3D[] = [];

        const rows = this.height / this.scale;
        const columns = this.width / this.scale;

        for (let row = 0; row < rows - 1; row++) {
            for (let column = 0; column < columns - 1; column++) {
                const x = column * this.scale;
                const y = row * this.scale;

                const vertex1 = new THREE.Vector3(x, y, this.heightMap[row][column]);
                const vertex2 = new THREE.Vector3(x + this.scale, y, this.heightMap[row][column + 1]);
                const vertex3 = new THREE.Vector3(x + this.scale, y + this.scale, this.heightMap[row + 1][column + 1]);
                const vertex4 = new THREE.Vector3(x, y + this.scale, this.heightMap[row + 1][column]);

                const mesh1 = this.buildTriangle(vertex1, vertex2, vertex3);
                const mesh2 = this.buildTriangle(vertex1, vertex3, vertex4);

                meshes.push(mesh1);
                meshes.push(mesh2);
            }
        }

        return meshes;
    }

    initHeightMap(yOff: number = 0) {
        const rows = this.height / this.scale;
        const columns = this.width / this.scale;

        let realXOff = 0;
        let realYOff = yOff;

        for (let row = 0; row < rows; row++) {
            this.heightMap[row] = [];
            realXOff = 0;
            for (let column = 0; column < columns; column++) {
                this.heightMap[row][column] = this.modulateValueBetween(this.perlinNoise.get(realXOff, realYOff) % 1, -25, 25);
                realXOff += 0.1;
            }
            realYOff += 0.1;
        }
    }

    modulateValueBetween(value: number, min: number, max: number) {
        return min + (max - min) * value;
    }
}

export default MapBuilder;