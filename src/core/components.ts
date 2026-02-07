import { Component, Entity } from './Entity';
import { Vector2, Vector3, Color } from './Math';

/**
 * Transform component for 2D positioning and rotation
 */
export class Transform2D extends Component {
    position: Vector2 = new Vector2();
    scale: Vector2 = new Vector2(1, 1);
    rotation: number = 0; // in radians

    update(deltaTime: number): void {
        // Transform updates are manual
    }

    /**
     * Move entity
     */
    translate(offset: Vector2): void {
        this.position = this.position.add(offset);
    }

    /**
     * Rotate entity
     */
    rotate(angle: number): void {
        this.rotation += angle;
    }

    /**
     * Set position
     */
    setPosition(x: number, y: number): void {
        this.position = new Vector2(x, y);
    }

    /**
     * Set scale
     */
    setScale(sx: number, sy: number = sx): void {
        this.scale = new Vector2(sx, sy);
    }
}

/**
 * Transform component for 3D positioning
 */
export class Transform3D extends Component {
    position: Vector3 = new Vector3();
    scale: Vector3 = new Vector3(1, 1, 1);
    // Euler angles in radians
    rotation: Vector3 = new Vector3();

    update(deltaTime: number): void {
        // Transform updates are manual
    }

    translate(offset: Vector3): void {
        this.position = this.position.add(offset);
    }

    setPosition(x: number, y: number, z: number): void {
        this.position = new Vector3(x, y, z);
    }

    setScale(sx: number, sy: number = sx, sz: number = sx): void {
        this.scale = new Vector3(sx, sy, sz);
    }

    setRotation(rx: number, ry: number, rz: number): void {
        this.rotation = new Vector3(rx, ry, rz);
    }
}

/**
 * Sprite component for 2D rendering
 */
export class Sprite extends Component {
    width: number = 50;
    height: number = 50;
    color: Color = Color.white();
    texture: HTMLImageElement | null = null;
    sourceX: number = 0;
    sourceY: number = 0;
    sourceWidth: number | null = null;
    sourceHeight: number | null = null;

    update(deltaTime: number): void {
        // Updates handled by renderer
    }

    /**
     * Set sprite size
     */
    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    /**
     * Set sprite color
     */
    setColor(color: Color): void {
        this.color = color;
    }

    /**
     * Load texture from URL
     */
    async loadTexture(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.texture = img;
                if (!this.sourceWidth) {
                    this.sourceWidth = img.width;
                    this.sourceHeight = img.height;
                }
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    }
}

/**
 * Circle component for 2D circular shapes
 */
export class Circle extends Component {
    radius: number = 25;
    color: Color = Color.white();
    filled: boolean = true;
    lineWidth: number = 1;

    update(deltaTime: number): void {
        // Updates handled by renderer
    }

    setRadius(radius: number): void {
        this.radius = radius;
    }

    setColor(color: Color): void {
        this.color = color;
    }
}

/**
 * Rectangle component for 2D rectangle shapes
 */
export class Rectangle extends Component {
    width: number = 50;
    height: number = 50;
    color: Color = Color.white();
    filled: boolean = true;
    lineWidth: number = 1;

    update(deltaTime: number): void {
        // Updates handled by renderer
    }

    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    setColor(color: Color): void {
        this.color = color;
    }
}

/**
 * Rigidbody component for physics
 */
export class Rigidbody2D extends Component {
    velocity: Vector2 = new Vector2();
    acceleration: Vector2 = new Vector2();
    mass: number = 1;
    friction: number = 0.1;
    isStatic: boolean = false;
    gravity: number = 9.8;

    update(deltaTime: number): void {
        if (this.isStatic) return;

        const transform = this.entity?.getComponent(Transform2D);
        if (!transform) return;

        // Apply gravity
        this.acceleration.y += this.gravity;

        // Update velocity
        this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));

        // Apply friction
        this.velocity = this.velocity.multiply(1 - this.friction);

        // Update position
        transform.translate(this.velocity.multiply(deltaTime));

        // Reset acceleration
        this.acceleration = new Vector2();
    }

    /**
     * Apply force to rigidbody
     */
    applyForce(force: Vector2): void {
        const acceleration = force.multiply(1 / this.mass);
        this.acceleration = this.acceleration.add(acceleration);
    }

    /**
     * Set velocity
     */
    setVelocity(x: number, y: number): void {
        this.velocity = new Vector2(x, y);
    }
}
