/**
 * Vector2 class for 2D mathematics
 */
export class Vector2 {
    constructor(public x: number = 0, public y: number = 0) {}

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const len = this.length();
        if (len === 0) return new Vector2();
        return new Vector2(this.x / len, this.y / len);
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}

/**
 * Vector3 class for 3D mathematics
 */
export class Vector3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vector3 {
        const len = this.length();
        if (len === 0) return new Vector3();
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }

    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }
}

/**
 * Color class for RGBA color representation
 */
export class Color {
    constructor(
        public r: number = 1,
        public g: number = 1,
        public b: number = 1,
        public a: number = 1
    ) {}

    toHex(): string {
        const toHex = (n: number) => {
            const hex = Math.floor(n * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }

    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    static white(): Color {
        return new Color(1, 1, 1, 1);
    }

    static black(): Color {
        return new Color(0, 0, 0, 1);
    }

    static red(): Color {
        return new Color(1, 0, 0, 1);
    }

    static green(): Color {
        return new Color(0, 1, 0, 1);
    }

    static blue(): Color {
        return new Color(0, 0, 1, 1);
    }
}
