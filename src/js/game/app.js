// Import Phaser as ES6 module
import Phaser from 'phaser';
import properties from './properties.js';
import boot from './states/boot.js';
import preloader from './states/preloader.js';
import load from './states/load.js';
import splash from './states/splash.js';
import gameState from './states/game.js';

// Initialize game with modern ES6+ syntax
const game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

// Define game states
const gameStates = {
  boot,
  preloader,
  load,
  splash,
  game: gameState
};

// Register all states using modern iteration
Object.entries(gameStates).forEach(([name, state]) => {
  game.state.add(name, state);
});

// Start the game
game.state.start('boot');
