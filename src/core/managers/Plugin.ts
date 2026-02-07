import { EventEmitter } from "events";

interface Plugin {
    name: string;
    version: string;
    init?: (manager: PluginManager) => void | Promise<void>;
    destroy?: () => void | Promise<void>;
}

export class PluginManager extends EventEmitter {
    private plugins: Map<string, Plugin> = new Map();
    private initialized: Set<string> = new Set();

    /**
     * Register a plugin
     */
    register(plugin: Plugin): void {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`Plugin "${plugin.name}" is already registered`);
        }
        this.plugins.set(plugin.name, plugin);
        this.emit("plugin:registered", plugin);
    }

    /**
     * Initialize a plugin
     */
    async init(pluginName: string): Promise<void> {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin "${pluginName}" not found`);
        }
        if (this.initialized.has(pluginName)) {
            return;
        }

        if (plugin.init) {
            await plugin.init(this);
        }
        this.initialized.add(pluginName);
        this.emit("plugin:initialized", plugin);
    }

    /**
     * Initialize all plugins
     */
    async initAll(): Promise<void> {
        for (const pluginName of this.plugins.keys()) {
            await this.init(pluginName);
        }
    }

    /**
     * Unload a plugin
     */
    async unload(pluginName: string): Promise<void> {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin "${pluginName}" not found`);
        }

        if (plugin.destroy) {
            await plugin.destroy();
        }
        this.initialized.delete(pluginName);
        this.emit("plugin:unloaded", plugin);
    }

    /**
     * Get a plugin
     */
    get(pluginName: string): Plugin | undefined {
        return this.plugins.get(pluginName);
    }

    /**
     * Get all plugins
     */
    getAll(): Plugin[] {
        return Array.from(this.plugins.values());
    }

    /**
     * Check if plugin is initialized
     */
    isInitialized(pluginName: string): boolean {
        return this.initialized.has(pluginName);
    }
}