// Phaser CE is loaded as a classic script before this module (see vite.config.js)
import properties from './properties.js';
import boot from './states/boot.js';
import preloader from './states/preloader.js';
import load from './states/load.js';
import splash from './states/splash.js';
import gameState from './states/game.js';

const game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');
window.game = game;

const gameStates = { boot, preloader, load, splash, game: gameState };
Object.entries(gameStates).forEach(([name, state]) => {
  game.state.add(name, state);
});

game.state.start('boot');
