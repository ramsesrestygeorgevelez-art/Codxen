import {
    GameEngine,
    Entity,
    Vector2,
    Color,
    Transform2D,
    Sprite,
    Rectangle,
    Circle,
    Rigidbody2D,
} from '../index';

/**
 * Simple 2D Platformer Game Example
 */
export class PlatformerGame {
    private engine: GameEngine;
    private player: Entity;
    public playerSpeed: number = 200;

    constructor() {
        this.playerSpeed = 200;
        this.engine = new GameEngine('game-container', '2d');

        // Create player
        this.player = this.engine.createEntity('Player');
        this.player.addComponent(Transform2D).setPosition(100, 300);
        const sprite = this.player.addComponent(Sprite);
        sprite.setSize(30, 50);
        sprite.setColor(Color.blue());
        const rigidbody = this.player.addComponent(Rigidbody2D);
        rigidbody.setVelocity(0, 0);

        // Create platforms
        this.createPlatform('Platform1', 100, 500, 400, 30);
        this.createPlatform('Platform2', 500, 450, 300, 30);
        this.createPlatform('Platform3', 900, 400, 200, 30);

        // Create obstacles
        this.createObstacle('Obstacle1', 300, 450, 30, 30);
        this.createObstacle('Obstacle2', 600, 380, 30, 30);

        // Setup input handling
        this.setupInput();

        // Start engine
        this.engine.start();
    }

    /**
     * Create a platform
     */
    private createPlatform(name: string, x: number, y: number, width: number, height: number): void {
        const platform = this.engine.createEntity(name);
        platform.addComponent(Transform2D).setPosition(x, y);
        const rect = platform.addComponent(Rectangle);
        rect.setSize(width, height);
        rect.setColor(Color.green());
        platform.addComponent(Rigidbody2D).isStatic = true;
    }

    /**
     * Create an obstacle
     */
    private createObstacle(name: string, x: number, y: number, width: number, height: number): void {
        const obstacle = this.engine.createEntity(name);
        obstacle.addComponent(Transform2D).setPosition(x, y);
        const circle = obstacle.addComponent(Circle);
        circle.setRadius(width / 2);
        circle.setColor(Color.red());
        obstacle.addComponent(Rigidbody2D).isStatic = true;
    }

    /**
     * Setup input handling
     */
    private setupInput(): void {
        const input = this.engine.getInput();
        if (!input) return;

        // Custom update loop for input
        const self = this;
        const originalStart = this.engine.start.bind(this.engine);
        this.engine.start = function () {
            originalStart();
            const gameLoop = setInterval(() => {
                const transform = self.player.getComponent(Transform2D);
                const rigidbody = self.player.getComponent(Rigidbody2D);

                if (!transform || !rigidbody) return;

                // Handle horizontal movement
                if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('a')) {
                    rigidbody.velocity.x = -self.playerSpeed;
                } else if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('d')) {
                    rigidbody.velocity.x = self.playerSpeed;
                } else {
                    rigidbody.velocity.x = 0;
                }

                // Handle jump
                if ((input.isKeyJustPressed(' ') || input.isKeyJustPressed('w')) && rigidbody.velocity.y === 0) {
                    rigidbody.velocity.y = -400;
                }

                // Handle mode switching
                if (input.isKeyJustPressed('3')) {
                    self.engine.switchRenderMode('3d');
                    clearInterval(gameLoop);
                }
            }, 1000 / 60); // 60 FPS
        };
    }

    /**
     * Get engine
     */
    getEngine(): GameEngine {
        return this.engine;
    }
}
