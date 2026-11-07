// Phaser is loaded globally via script tag

const splash = function () { };

let fireButton;
let shops;
let text;
let phone;
let message;
let title;
let tanuki;
let youDrunk;
const style = { font: 'bold 32px monospace', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };

splash.prototype.preload = function () {
};

splash.prototype.create = function () {
  // Load audio after user interaction to avoid AudioContext issues
  this.loadAudioAfterInteraction();

  // Use placeholder background if starfield isn't loaded yet
  if (this.game.cache.checkImageKey('starfield')) {
    this.starfield = this.add.tileSprite(0, 0, 1024, 768, 'starfield');
  } else {
    // Simple gradient background as fallback
    this.starfield = this.add.graphics();
    this.starfield.beginFill(0x000033);
    this.starfield.drawRect(0, 0, 1024, 768);
    this.starfield.endFill();
  }

  this.ground = this.add.tileSprite(0, 656, 1024, 112, 'ground');
  shops = this.add.sprite(-100, 0, 'shop');

  tanuki = this.add.image(0, 0, 'splash-1');

  fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.starting = false;
  this.input.onDown.addOnce(this.startGame, this);
  text = this.add.text(512, 650, 'Tap or click to start', style);
  text.anchor.x = 0.5;
  this.time.events.add(Phaser.Timer.SECOND * 2, this.addPhone, this);
  this.time.events.add(Phaser.Timer.SECOND * 3, this.addMessage, this);
  this.time.events.add(Phaser.Timer.SECOND * 4, this.addTitle, this);
  this.time.events.add(Phaser.Timer.SECOND * 4.5, this.addYouDrunk, this);
};

splash.prototype.loadAudioAfterInteraction = function () {
  // Load audio files after user interaction
  this.game.load.audio('ringing', 'audio/ringing.mp3');
  this.game.load.audio('music', 'audio/music.mp3');

  // Play ringing sound once loaded
  this.game.load.onLoadComplete.add(() => {
    if (this.game.cache.checkSoundKey('ringing')) {
      this.sound = this.sound.play('ringing');
    }
  }, this);

  this.game.load.start();
};

splash.prototype.update = function () {
  if (fireButton.isDown) {
    this.startGame();
  }
};

// Slides the title screen away, then starts the game. Taps and clicks use the
// onDown event (added in create) so a quick tap between frames still counts.
splash.prototype.startGame = function () {
  if (this.starting) {
    return;
  }
  this.starting = true;
  [text, phone, message, title, tanuki, shops, youDrunk]
    .filter(Boolean)
    .forEach((item, index, items) => {
      const slide = this.add.tween(item).to({ x: -1440 }, 1000, 'Linear', true);
      if (index === items.length - 1) {
        slide.onComplete.add(() => this.game.state.start('game'));
      }
    });
};

// helper functions
splash.prototype.addPhone = function () {
  phone = this.add.image(325, 400, 'splash-phone');
};

splash.prototype.addMessage = function () {
  message = this.add.image(25, 260, 'splash-message-box');
  message.animations.add('shake');
  message.animations.play('shake', 30, true);
  this.add.tween(message).to({ x: 50 }, 150, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
};

splash.prototype.addTitle = function () {
  title = this.add.image(175, 0, 'splash-text');
};

splash.prototype.addYouDrunk = function () {
  youDrunk = this.add.image(300, 230, 'youdrunk');
};

export default splash;
