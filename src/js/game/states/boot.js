import properties from '../properties.js';

const boot = {};

boot.create = function () {
  this.game.sound.mute = properties.mute;
  this.game.state.start('preloader');
};

export default boot;
