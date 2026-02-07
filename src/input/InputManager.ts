/**
 * Input Manager for handling keyboard, mouse, and touch input
 */
export class InputManager {
    private keysPressed: Set<string> = new Set();
    private keysJustPressed: Set<string> = new Set();
    private keysJustReleased: Set<string> = new Set();
    private mousePosition = { x: 0, y: 0 };
    private mouseButtonsPressed: Set<number> = new Set();
    private mouseButtonsJustPressed: Set<number> = new Set();
    private mouseButtonsJustReleased: Set<number> = new Set();
    private touches: Map<number, { x: number; y: number }> = new Map();

    constructor(canvas: HTMLCanvasElement) {
        this.setupKeyboardListeners();
        this.setupMouseListeners(canvas);
        this.setupTouchListeners(canvas);
    }

    /**
     * Setup keyboard event listeners
     */
    private setupKeyboardListeners(): void {
        window.addEventListener('keydown', (e) => {
            if (!this.keysPressed.has(e.key)) {
                this.keysJustPressed.add(e.key);
            }
            this.keysPressed.add(e.key);
        });

        window.addEventListener('keyup', (e) => {
            this.keysPressed.delete(e.key);
            this.keysJustReleased.add(e.key);
        });
    }

    /**
     * Setup mouse event listeners
     */
    private setupMouseListeners(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        });

        canvas.addEventListener('mousedown', (e) => {
            if (!this.mouseButtonsPressed.has(e.button)) {
                this.mouseButtonsJustPressed.add(e.button);
            }
            this.mouseButtonsPressed.add(e.button);
        });

        canvas.addEventListener('mouseup', (e) => {
            this.mouseButtonsPressed.delete(e.button);
            this.mouseButtonsJustReleased.add(e.button);
        });

        canvas.addEventListener('mouseout', () => {
            this.mouseButtonsPressed.clear();
        });
    }

    /**
     * Setup touch event listeners
     */
    private setupTouchListeners(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('touchstart', (e) => {
            const rect = canvas.getBoundingClientRect();
            for (const touch of Array.from(e.touches)) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                });
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            const rect = canvas.getBoundingClientRect();
            for (const touch of Array.from(e.touches)) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                });
            }
        });

        canvas.addEventListener('touchend', (e) => {
            for (const touch of Array.from(e.changedTouches)) {
                this.touches.delete(touch.identifier);
            }
        });
    }

    /**
     * Check if key is pressed
     */
    isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    /**
     * Check if key was just pressed this frame
     */
    isKeyJustPressed(key: string): boolean {
        return this.keysJustPressed.has(key);
    }

    /**
     * Check if key was just released this frame
     */
    isKeyJustReleased(key: string): boolean {
        return this.keysJustReleased.has(key);
    }

    /**
     * Get all pressed keys
     */
    getPressedKeys(): string[] {
        return Array.from(this.keysPressed);
    }

    /**
     * Get mouse position
     */
    getMousePosition(): { x: number; y: number } {
        return this.mousePosition;
    }

    /**
     * Check if mouse button is pressed
     */
    isMouseButtonPressed(button: number = 0): boolean {
        return this.mouseButtonsPressed.has(button);
    }

    /**
     * Check if mouse button was just pressed
     */
    isMouseButtonJustPressed(button: number = 0): boolean {
        return this.mouseButtonsJustPressed.has(button);
    }

    /**
     * Check if mouse button was just released
     */
    isMouseButtonJustReleased(button: number = 0): boolean {
        return this.mouseButtonsJustReleased.has(button);
    }

    /**
     * Get active touches
     */
    getTouches(): Array<{ id: number; x: number; y: number }> {
        const result: Array<{ id: number; x: number; y: number }> = [];
        for (const [id, pos] of this.touches.entries()) {
            result.push({ id, ...pos });
        }
        return result;
    }

    /**
     * Update input state (call once per frame)
     */
    update(): void {
        this.keysJustPressed.clear();
        this.keysJustReleased.clear();
        this.mouseButtonsJustPressed.clear();
        this.mouseButtonsJustReleased.clear();
    }
}
