import properties from '../properties.js';

const boot = {};

boot.create = function () {
  this.game.sound.mute = properties.mute;

  // Step the game logic at a fixed 60 per second, catching up on slow frames.
  // Scrolling moves a set amount per step, so with one step per frame it ran
  // twice as fast on a 120Hz screen and lagged behind physics on slow ones.
  this.game.forceSingleUpdate = false;

  // The game is drawn at 1024x768; scale it to fit any window (phone to 4K)
  // without cropping, centered with letterboxing.
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  this.game.state.start('preloader');
};

export default boot;
