import properties from '../properties.js';

const boot = {};

boot.create = function () {
  this.game.sound.mute = properties.mute;

  // The game is drawn at 1024x768; scale it to fit any window (phone to 4K)
  // without cropping, centered with letterboxing.
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  this.game.state.start('preloader');
};

export default boot;
