import properties from '../properties.js';

const boot = {};

boot.create = function () {
  this.game.sound.mute = properties.mute;

  // Hide loading spinner once Phaser is ready
  const loadingSpinner = document.querySelector('.loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }

  this.game.state.start('preloader');
};

export default boot;
