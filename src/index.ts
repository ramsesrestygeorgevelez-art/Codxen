import { Scene, Entity } from './core/Entity';
import { Canvas2DRenderer, RenderOptions } from './graphics/Canvas2DRenderer';
import { WebGLRenderer, WebGLRenderOptions } from './graphics/WebGLRenderer';
import { InputManager } from './input/InputManager';

export type RenderMode = '2d' | '3d';

/**
 * Main Game Engine class
 */
export class GameEngine {
    private scene: Scene;
    private canvas2DRenderer: Canvas2DRenderer | null = null;
    private webglRenderer: WebGLRenderer | null = null;
    private inputManager: InputManager | null = null;
    private renderMode: RenderMode;
    private isRunning: boolean = false;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;
    private fpsUpdateTime: number = 0;

    constructor(containerId: string, renderMode: RenderMode = '2d') {
        this.scene = new Scene();
        this.renderMode = renderMode;
        this.initializeRenderer(containerId);
    }

    /**
     * Initialize renderer based on mode
     */
    private initializeRenderer(containerId: string): void {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }

        // Get window dimensions
        const width = window.innerWidth;
        const height = window.innerHeight - 40; // Account for UI bar

        if (this.renderMode === '2d') {
            const options: RenderOptions = {
                width,
                height,
                backgroundColor: '#1a1a1a',
            };
            this.canvas2DRenderer = new Canvas2DRenderer(containerId, options);
            this.inputManager = new InputManager(this.canvas2DRenderer.getCanvas());
        } else {
            const options: WebGLRenderOptions = {
                width,
                height,
                clearColor: [0.1, 0.1, 0.1, 1],
            };
            this.webglRenderer = new WebGLRenderer(containerId, options);
            this.inputManager = new InputManager(this.webglRenderer.getCanvas());
        }
    }

    /**
     * Get the current scene
     */
    getScene(): Scene {
        return this.scene;
    }

    /**
     * Get input manager
     */
    getInput(): InputManager | null {
        return this.inputManager;
    }

    /**
     * Switch render mode
     */
    switchRenderMode(mode: RenderMode): void {
        if (mode === this.renderMode) return;

        // Clean up current renderer
        const container = document.getElementById('game-container');
        if (container) {
            // Remove current canvas
            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.remove();
            }
        }

        this.renderMode = mode;
        this.initializeRenderer('game-container');
    }

    /**
     * Start the game loop
     */
    start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        this.fpsUpdateTime = this.lastTime;
        this.gameLoop();
    }

    /**
     * Stop the game loop
     */
    stop(): void {
        this.isRunning = false;
    }

    /**
     * Main game loop
     */
    private gameLoop = (): void => {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update scene
        this.scene.update(deltaTime);

        // Update input
        if (this.inputManager) {
            this.inputManager.update();
        }

        // Render
        if (this.canvas2DRenderer) {
            this.canvas2DRenderer.render(this.scene);
        } else if (this.webglRenderer) {
            this.webglRenderer.render(this.scene);
        }

        // Calculate FPS
        this.frameCount++;
        if (currentTime - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
            this.updateUI();
        }

        requestAnimationFrame(this.gameLoop);
    };

    /**
     * Update UI display
     */
    private updateUI(): void {
        const fpsElement = document.getElementById('fps');
        const objectsElement = document.getElementById('objects');
        const modeElement = document.getElementById('mode');

        if (fpsElement) fpsElement.textContent = this.fps.toString();
        if (objectsElement) objectsElement.textContent = this.scene.getEntityCount().toString();
        if (modeElement) modeElement.textContent = this.renderMode.toUpperCase();
    }

    /**
     * Handle window resize
     */
    onWindowResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight - 40;

        if (this.canvas2DRenderer) {
            this.canvas2DRenderer.resize(width, height);
        } else if (this.webglRenderer) {
            this.webglRenderer.resize(width, height);
        }
    }

    /**
     * Get FPS
     */
    getFPS(): number {
        return this.fps;
    }

    /**
     * Create entity
     */
    createEntity(name: string = 'Entity'): Entity {
        const entity = new Entity(name);
        this.scene.addEntity(entity, name);
        return entity;
    }

    /**
     * Destroy entity
     */
    destroyEntity(entity: Entity): void {
        this.scene.removeEntity(entity);
        entity.destroy();
    }
}

/**
 * Export all exports from core modules
 */
export * from './core/Math';
export * from './core/Entity';
export * from './core/components';
export * from './graphics/Canvas2DRenderer';
export * from './graphics/WebGLRenderer';
export * from './input/InputManager';
