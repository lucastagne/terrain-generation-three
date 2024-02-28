class PerlinNoise {
    memory: {[key: string]: number};
    gradients: {[key: string]: {x: number, y: number}};

    constructor() {
        this.memory = {};
        this.gradients = {};
    }

    randomVector() {
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }

    dotProductGrid(x: number, y: number, vx: number, vy: number) {
        let gVector;
        let dVector = {x: x - vx, y: y - vy};
        const key = "" + vx + "," + vy;
        if (this.gradients[key]){
            gVector = this.gradients[key];
        } else {
            gVector = this.randomVector();
            this.gradients[key] = gVector;
        }
        return dVector.x * gVector.x + dVector.y * gVector.y;
    }

    smootherStep(t: number) {
        return 6 * t**5 - 15 * t**4 + 10 * t**3;
    }

    interpolate(x: number, y: number, a: number) {
        const x1 = x * Math.PI;
        const y1 = y * Math.PI;
        const x2 = this.smootherStep(x1);
        const y2 = this.smootherStep(y1);
        return x2 + (y2 - x2) * a;
    }

    get(x: number, y: number) {
        const key = "" + x + "," + y;
        if (this.memory.hasOwnProperty(key))
            return this.memory[key];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dotProductGrid(x, y, xf,   yf);
        let tr = this.dotProductGrid(x, y, xf+1, yf);
        let bl = this.dotProductGrid(x, y, xf,   yf+1);
        let br = this.dotProductGrid(x, y, xf+1, yf+1);
        let xt = this.interpolate(x-xf, tl, tr);
        let xb = this.interpolate(x-xf, bl, br);
        let v = this.interpolate(y-yf, xt, xb);
        this.memory[key] = v;
        return v;
    }
}

export default PerlinNoise;