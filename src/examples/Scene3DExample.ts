import {
    GameEngine,
    Entity,
    Vector3,
    Color,
    Transform3D,
} from '../index';

/**
 * Simple 3D Scene Example
 */
export class Scene3DExample {
    private engine: GameEngine;
    private cubes: Entity[] = [];

    constructor() {
        this.engine = new GameEngine('game-container', '3d');

        // Create multiple 3D objects
        this.createCube('Cube1', -2, 0, -5, Color.red());
        this.createCube('Cube2', 0, 0, -5, Color.green());
        this.createCube('Cube3', 2, 0, -5, Color.blue());

        // Setup input handling
        this.setupInput();

        // Start engine
        this.engine.start();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.onWindowResize();
        });
    }

    /**
     * Create a 3D cube
     */
    private createCube(name: string, x: number, y: number, z: number, color: Color): void {
        const cube = this.engine.createEntity(name);
        const transform = cube.addComponent(Transform3D);
        transform.setPosition(x, y, z);
        transform.setScale(0.5, 0.5, 0.5);

        this.cubes.push(cube);
    }

    /**
     * Setup input handling
     */
    private setupInput(): void {
        const input = this.engine.getInput();
        if (!input) return;

        // Rotate cubes
        const updateRotation = setInterval(() => {
            for (const cube of this.cubes) {
                const transform = cube.getComponent(Transform3D);
                if (transform) {
                    transform.rotation.x += 0.01;
                    transform.rotation.y += 0.015;
                    transform.rotation.z += 0.005;
                }
            }

            // Handle mode switching
            if (input.isKeyJustPressed('2')) {
                this.engine.switchRenderMode('2d');
                clearInterval(updateRotation);
            }
        }, 1000 / 60); // 60 FPS
    }

    /**
     * Get engine
     */
    getEngine(): GameEngine {
        return this.engine;
    }
}
