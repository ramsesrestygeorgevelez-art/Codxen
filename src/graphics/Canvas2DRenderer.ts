import { Scene, Entity } from '../core/Entity';
import { Transform2D, Sprite, Circle, Rectangle } from '../core/components';

export interface RenderOptions {
    width: number;
    height: number;
    backgroundColor?: string;
}

/**
 * 2D Canvas Renderer
 */
export class Canvas2DRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private options: RenderOptions;

    constructor(containerId: string, options: RenderOptions) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = options.width;
        this.canvas.height = options.height;
        container.appendChild(this.canvas);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = ctx;
        this.options = options;
    }

    /**
     * Render a scene
     */
    render(scene: Scene): void {
        // Clear canvas
        this.ctx.fillStyle = this.options.backgroundColor || '#222222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all entities
        const entities = this.getAllEntities(scene.getEntities());
        for (const entity of entities) {
            if (entity.active) {
                this.renderEntity(entity);
            }
        }
    }

    /**
     * Get all entities including children
     */
    private getAllEntities(entities: Entity[]): Entity[] {
        const result: Entity[] = [];
        for (const entity of entities) {
            result.push(entity);
            result.push(...this.getAllEntities(entity.getChildren()));
        }
        return result;
    }

    /**
     * Render a single entity
     */
    private renderEntity(entity: Entity): void {
        const transform = entity.getComponent(Transform2D);
        if (!transform) return;

        // Save context state
        this.ctx.save();

        // Apply transform
        this.ctx.translate(transform.position.x, transform.position.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.scale.x, transform.scale.y);

        // Render sprite
        const sprite = entity.getComponent(Sprite);
        if (sprite) {
            this.renderSprite(sprite);
        }

        // Render circle
        const circle = entity.getComponent(Circle);
        if (circle) {
            this.renderCircle(circle);
        }

        // Render rectangle
        const rect = entity.getComponent(Rectangle);
        if (rect) {
            this.renderRectangle(rect);
        }

        // Restore context state
        this.ctx.restore();
    }

    /**
     * Render sprite component
     */
    private renderSprite(sprite: Sprite): void {
        if (sprite.texture) {
            this.ctx.globalAlpha = sprite.color.a;
            this.ctx.drawImage(
                sprite.texture,
                sprite.sourceX,
                sprite.sourceY,
                sprite.sourceWidth || sprite.texture.width,
                sprite.sourceHeight || sprite.texture.height,
                -sprite.width / 2,
                -sprite.height / 2,
                sprite.width,
                sprite.height
            );
        } else {
            // Draw colored rectangle if no texture
            this.ctx.fillStyle = sprite.color.toHex();
            this.ctx.globalAlpha = sprite.color.a;
            this.ctx.fillRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        }
        this.ctx.globalAlpha = 1;
    }

    /**
     * Render circle component
     */
    private renderCircle(circle: Circle): void {
        this.ctx.fillStyle = circle.color.toHex();
        this.ctx.globalAlpha = circle.color.a;

        this.ctx.beginPath();
        this.ctx.arc(0, 0, circle.radius, 0, Math.PI * 2);

        if (circle.filled) {
            this.ctx.fill();
        } else {
            this.ctx.lineWidth = circle.lineWidth;
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;
    }

    /**
     * Render rectangle component
     */
    private renderRectangle(rect: Rectangle): void {
        this.ctx.fillStyle = rect.color.toHex();
        this.ctx.globalAlpha = rect.color.a;

        if (rect.filled) {
            this.ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        } else {
            this.ctx.lineWidth = rect.lineWidth;
            this.ctx.strokeRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        }

        this.ctx.globalAlpha = 1;
    }

    /**
     * Get canvas
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Get context
     */
    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    /**
     * Resize canvas
     */
    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.options.width = width;
        this.options.height = height;
    }

    /**
     * Get canvas dimensions
     */
    getDimensions(): { width: number; height: number } {
        return { width: this.canvas.width, height: this.canvas.height };
    }
}
