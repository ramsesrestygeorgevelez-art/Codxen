import { PlatformerGame } from './examples/PlatformerGame';
import { Scene3DExample } from './examples/Scene3DExample';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start with 2D platformer game
    const game = new PlatformerGame();

    // Handle window resize
    window.addEventListener('resize', () => {
        game.getEngine().onWindowResize();
    });

    // Add keyboard shortcut to switch between modes
    document.addEventListener('keydown', (e) => {
        if (e.key === '2') {
            // Switch to 2D
            const newGame = new PlatformerGame();
            window.location.reload();
        } else if (e.key === '3') {
            // Switch to 3D
            const newGame = new Scene3DExample();
            window.location.reload();
        }
    });
});
