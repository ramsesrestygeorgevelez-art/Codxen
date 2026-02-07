class Animate {
    private animations: Map<string, any>;
    
    constructor() {
        this.animations = new Map();
    }
    /**
     * Start an animation
     */
    startAnimation(name: string, config: any): void {
        if (this.animations.has(name)) {
            throw new Error(`Animation "${name}" is already running`);
        }
        // Placeholder for starting animation logic
        this.animations.set(name, config);
        console.log(`Animation "${name}" started with config:`, config);
    }

    /** 
     * Create an animation
     * 
     * @example
     * animationManager.createAnimation('walk', {
     *     frames: [0, 1, 2, 3],
     *     frameRate: 10,
     *     loop: true
     * });
     */
    createAnimation(name: string, config: any): void {
        if (this.animations.has(name)) {
            throw new Error(`Animation "${name}" already exists`);
        }
        this.animations.set(name, config);
        console.log(`Animation "${name}" created with config:`, config);
    }
    /**
     * Stop an animation
     */
    stopAnimation(name: string): void {
        if (!this.animations.has(name)) {
            throw new Error(`Animation "${name}" is not running`);
        }
        // Placeholder for stopping animation logic
        this.animations.delete(name);
        console.log(`Animation "${name}" stopped`);
    }
    
    /**
     * Check if an animation is running
     */
    isRunning(name: string): boolean {
        return this.animations.has(name);
    }
    /**
     * Get an animation
     * @example
     * const walkAnimation = animationManager.getAnimation('walk');
     * console.log(walkAnimation);
     */
    getAnimation(name: string): any {
        return this.animations.get(name);
    }
}