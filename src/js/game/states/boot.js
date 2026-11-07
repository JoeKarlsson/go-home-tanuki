import { applySoundSetting } from '../pageControls.js';

const boot = {};

boot.create = function () {
  applySoundSetting(this.game);

  // Step the game logic at a fixed 60 per second, catching up on slow frames.
  // Scrolling moves a set amount per step, so with one step per frame it ran
  // twice as fast on a 120Hz screen and lagged behind physics on slow ones.
  this.game.forceSingleUpdate = false;

  // The game is drawn at 1024x768; scale it to fit any window (phone to 4K)
  // without cropping, centered with letterboxing.
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  // Space would scroll the page around the game, which matters when it's embedded
  this.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

  // Show the canvas only once it's scaled to fit, so it doesn't jump into place.
  // A forced refresh always calls the resize callback, and Phaser lays the canvas
  // out right after it.
  this.scale.setResizeCallback(() => {
    this.scale.setResizeCallback(null);
    queueMicrotask(() => {
      document.querySelector('.poster').remove();
      this.game.canvas.style.visibility = 'visible';
    });
  });
  this.scale.refresh();

  this.game.state.start('preloader');
};

export default boot;
