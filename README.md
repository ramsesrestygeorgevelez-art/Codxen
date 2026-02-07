# Codxen Game Engine

A modern, full-featured 2D/3D JavaScript game engine built with TypeScript, WebGL, and Canvas APIs.

## Features

✨ **Multi-Rendering Modes**
- 2D rendering using Canvas API
- 3D rendering using WebGL
- Easy mode switching at runtime

🎮 **Game Development Tools**
- Entity-Component System (ECS) architecture
- Scene management
- Transform components (2D & 3D)
- Sprite rendering
- Shape rendering (rectangles, circles)
- Physics simulation (2D rigidbodies)

⌨️ **Input System**
- Keyboard input with key states (pressed, just pressed, just released)
- Mouse input tracking (position, buttons)
- Touch input support
- Real-time input polling

📊 **Developer Tools**
- Built-in FPS counter
- Entity count display
- Render mode indicator
- Debug-friendly component system

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

The development server will open at `http://localhost:8080`

## Quick Start

### 1. Creating Entities

```typescript
import { GameEngine, Vector2, Color, Transform2D, Sprite } from 'codxen-engine';

// Create engine
const engine = new GameEngine('game-container', '2d');

// Create entity
const player = engine.createEntity('Player');
player.addComponent(Transform2D).setPosition(100, 100);

const sprite = player.addComponent(Sprite);
sprite.setSize(50, 50);
sprite.setColor(Color.blue());

// Start the game loop
engine.start();
```

### 2. Adding Physics

```typescript
import { Rigidbody2D } from 'codxen-engine';

const rigidbody = player.addComponent(Rigidbody2D);
rigidbody.mass = 1;
rigidbody.gravity = 9.8;
rigidbody.friction = 0.1;

// Apply force
const force = new Vector2(100, 0);
rigidbody.applyForce(force);
```

### 3. Handling Input

```typescript
const input = engine.getInput();

if (input.isKeyPressed('ArrowRight')) {
	const transform = player.getComponent(Transform2D);
	transform?.translate(new Vector2(5, 0));
}

if (input.isMouseButtonJustPressed(0)) {
	console.log('Left click at:', input.getMousePosition());
}
```

### 4. Scene Management

```typescript
const scene = engine.getScene();

// Get entity count
console.log('Entities:', scene.getEntityCount());

// Find entity by name
const foundEntity = scene.findEntity('Player');

// Destroy entity
engine.destroyEntity(player);
```

### 5. Creating 3D Games

```typescript
// Use '3d' render mode
const engine = new GameEngine('game-container', '3d');

// Use Transform3D instead of Transform2D
import { Transform3D, Vector3 } from 'codxen-engine';

const cube = engine.createEntity('Cube');
const transform = cube.addComponent(Transform3D);
transform.setPosition(0, 0, -5);
transform.setScale(1, 1, 1);
```

## Core Components

### Transform Components

**Transform2D** - For 2D positioning
```typescript
transform.position: Vector2
transform.scale: Vector2
transform.rotation: number (radians)
```

**Transform3D** - For 3D positioning
```typescript
transform.position: Vector3
transform.scale: Vector3
transform.rotation: Vector3 (Euler angles)
```

### Rendering Components

**Sprite** - 2D sprite with texture/color support
- `width`, `height` - Dimensions
- `color` - RGBA color
- `texture` - Optional image texture
- `loadTexture(url)` - Load image from URL\n

**Circle** - 2D circle shape
- `radius` - Circle radius
- `color` - RGBA color
- `filled` - Whether to fill or stroke

**Rectangle** - 2D rectangle shape
- `width`, `height` - Dimensions
- `color` - RGBA color
- `filled` - Whether to fill or stroke

### Physics Components

**Rigidbody2D** - 2D physics simulation
- `velocity` - Current velocity
- `mass` - Object mass
- `friction` - Friction coefficient
- `gravity` - Gravity strength
- `isStatic` - Whether object moves

## Math Classes

**Vector2** - 2D vector mathematics
```typescript
new Vector2(x, y)
add(), subtract(), multiply()
dot(), length(), normalize()
```

**Vector3** - 3D vector mathematics
```typescript
new Vector3(x, y, z)
add(), subtract(), multiply()
dot(), cross(), length(), normalize()
```

**Color** - RGBA color representation
```typescript
new Color(r, g, b, a) // Values 0-1
Color.red(), Color.green(), Color.blue()
Color.white(), Color.black()
```

## Examples

### 2D Platformer Game

The engine includes a built-in 2D platformer example:
- Player character that can move and jump
- Multiple platforms
- Obstacles
- Gravity physics

Press **2** to switch to 2D mode and **3** for 3D mode.

### 3D Scene Example

A 3D scene with rotating cubes demonstrating:
- 3D positioning
- WebGL rendering
- Real-time rotation
- 3D transform controls\n

## API Reference

### GameEngine Class

```typescript
// Constructor
new GameEngine(containerId, renderMode)
\n
// Methods
getScene(): Scene
getInput(): InputManager
start(): void
stop(): void
switchRenderMode(mode): void
createEntity(name): Entity
destroyEntity(entity): void
onWindowResize(): void
getFPS(): number
```

### Entity Class
\n
```typescript
addComponent<T>(ComponentClass): T
getComponent<T>(ComponentClass): T | null
removeComponent<T>(ComponentClass): void
addChild(entity): void
removeChild(entity): void
getChildren(): Entity[]
destroy(): void
```

### InputManager Class
\n
```typescript
isKeyPressed(key): boolean
isKeyJustPressed(key): boolean
isKeyJustReleased(key): boolean
getMousePosition(): { x, y }
isMouseButtonPressed(button): boolean
isMouseButtonJustPressed(button): boolean
getTouches(): Array<{id, x, y}>
```

## Architecture

### Entity-Component System (ECS)

The engine uses an ECS pattern for flexible game object composition:

- **Entities** are containers for components
- **Components** are individual pieces of functionality
- Components can communicate through their shared entity
- Supports inheritance hierarchy with parent-child relationships

### Rendering Pipeline

1. **Scene Update** - All entities and components update based on deltaTime
2. **Physics Step** - Rigidbodies apply forces and calculate new positions
3. **Render Pass** - Renderer draws all entities in proper order
4. **Input Update** - Clear frame-specific input states\n

## Performance Tips

1. Use pooling for frequently created/destroyed objects
2. Disable inactive entities instead of destroying them
3. Use static rigidbodies for immovable objects
4. Batch render calls when possible
5. Profile using built-in FPS counter

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL support for 3D rendering.

## Development Commands

```bash
npm start        # Start dev server
npm build        # Production build
npm build:dev    # Development build
npm dev          # Start with dev server
```

## Project Structure

```
src/
├── core/                 # Core engine systems
│   ├── Math.ts          # Vector and color classes
│   ├── Entity.ts        # Entity and Scene classes
│   └── components.ts    # Built-in components
├── graphics/            # Rendering systems
│   ├── Canvas2DRenderer.ts
│   └── WebGLRenderer.ts
├── input/               # Input handling
│   └── InputManager.ts
├── examples/            # Example games
│   ├── PlatformerGame.ts
│   └── Scene3DExample.ts
├── index.ts            # Main engine export
├── main.ts             # Entry point
└── index.html          # HTML template
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Future Enhancements

- [ ] Particle system
- [ ] Advanced lighting and shadows
- [ ] Sound/audio system
- [ ] Animation system
- [ ] Tilemap support
- [ ] Collision detection improvements
- [ ] Performance optimizations
- [ ] Built-in UI system
- [ ] Scripting support
- [ ] Asset pipeline
# Codxen