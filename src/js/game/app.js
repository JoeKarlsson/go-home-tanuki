// Phaser is loaded globally via script tag
import properties from './properties.js';
import boot from './states/boot.js';
import preloader from './states/preloader.js';
import load from './states/load.js';
import splash from './states/splash.js';
import gameState from './states/game.js';

const game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

// Register each state
game.state.add('boot', boot);
game.state.add('preloader', preloader);
game.state.add('load', load);
game.state.add('splash', splash);
game.state.add('game', gameState);

game.state.start('boot');
