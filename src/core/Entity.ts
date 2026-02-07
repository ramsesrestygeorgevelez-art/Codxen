/**
 * Component base class
 */
export abstract class Component {
    isEnabled: boolean = true;
    entity: Entity | null = null;

    abstract update(deltaTime: number): void;
}

/**
 * Entity class representing game objects
 */
export class Entity {
    private components: Map<Function, Component> = new Map();
    private children: Entity[] = [];
    private parent: Entity | null = null;

    constructor(
        public name: string = 'Entity',
        public active: boolean = true
    ) {}

    /**
     * Add a component to this entity
     */
    addComponent<T extends Component>(Component: new () => T): T {
        const component = new Component();
        component.entity = this;
        this.components.set(Component, component);
        return component;
    }

    /**
     * Get a component by type
     */
    getComponent<T extends Component>(Component: new () => T): T | null {
        return (this.components.get(Component) as T) || null;
    }

    /**
     * Remove a component
     */
    removeComponent<T extends Component>(Component: new () => T): void {
        this.components.delete(Component);
    }

    /**
     * Get all components
     */
    getComponents(): Component[] {
        return Array.from(this.components.values());
    }

    /**
     * Add a child entity
     */
    addChild(entity: Entity): void {
        entity.parent = this;
        this.children.push(entity);
    }

    /**
     * Remove a child entity
     */
    removeChild(entity: Entity): void {
        const index = this.children.indexOf(entity);
        if (index > -1) {
            this.children.splice(index, 1);
            entity.parent = null;
        }
    }

    /**
     * Get all children
     */
    getChildren(): Entity[] {
        return this.children;
    }

    /**
     * Get parent
     */
    getParent(): Entity | null {
        return this.parent;
    }

    /**
     * Update entity and all components
     */
    update(deltaTime: number): void {
        if (!this.active) return;

        for (const component of this.getComponents()) {
            if (component.isEnabled) {
                component.update(deltaTime);
            }
        }

        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

    /**
     * Destroy this entity and its children
     */
    destroy(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.components.clear();
        this.children = [];
    }
}

/**
 * Scene is a collection of entities
 */
export class Scene {
    private rootEntities: Entity[] = [];
    private allEntities: Map<string, Entity> = new Map();
    public name: string = 'Scene';

    /**
     * Add entity to scene
     */
    addEntity(entity: Entity, name?: string): void {
        const entityName = name || entity.name;
        entity.name = entityName;
        this.rootEntities.push(entity);
        this.registerEntity(entity);
    }

    /**
     * Register entity and its children in the map
     */
    private registerEntity(entity: Entity): void {
        this.allEntities.set(entity.name, entity);
        for (const child of entity.getChildren()) {
            this.registerEntity(child);
        }
    }

    /**
     * Remove entity from scene
     */
    removeEntity(entity: Entity): void {
        const index = this.rootEntities.indexOf(entity);
        if (index > -1) {
            this.rootEntities.splice(index, 1);
            this.unregisterEntity(entity);
        }
    }

    /**
     * Unregister entity and its children
     */
    private unregisterEntity(entity: Entity): void {
        this.allEntities.delete(entity.name);
        for (const child of entity.getChildren()) {
            this.unregisterEntity(child);
        }
    }

    /**
     * Find entity by name
     */
    findEntity(name: string): Entity | null {
        return this.allEntities.get(name) || null;
    }

    /**
     * Get all entities
     */
    getEntities(): Entity[] {
        return this.rootEntities;
    }

    /**
     * Get total entity count
     */
    getEntityCount(): number {
        return this.allEntities.size;
    }

    /**
     * Update all entities in scene
     */
    update(deltaTime: number): void {
        for (const entity of this.rootEntities) {
            entity.update(deltaTime);
        }
    }

    /**
     * Clear scene
     */
    clear(): void {
        this.rootEntities = [];
        this.allEntities.clear();
    }
}
