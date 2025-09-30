// Phaser is loaded globally via script tag

const splash = function () { };

let fireButton;
let shops;
let text;
let phone;
let message;
let title;
let tanuki;
let sound;
let tween;
let youDrunk;
let transitionSpeed = 2;
let tweenText;
let tweenPhone;
let tweenMessage;
let tweenTitle;
let tweenSplash;
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
  text = this.add.text(350, 650, 'Click to start', style);
  this.time.events.add(Phaser.Timer.SECOND * 2, this.addPhone, this);
  this.time.events.add(Phaser.Timer.SECOND * 3, this.addMessage, this);
  this.time.events.add(Phaser.Timer.SECOND * 4, this.addTitle, this);
  this.time.events.add(Phaser.Timer.SECOND * 4.5, this.addYouDrunk, this);
  tweenText = this.add.tween(text);
  tweenPhone = this.add.tween(phone);
  tweenMessage = this.add.tween(message);
  tweenTitle = this.add.tween(title);
  tweenSplash = this.add.tween(tanuki);
};

splash.prototype.loadAudioAfterInteraction = function () {
  // Load audio files after user interaction
  this.game.load.audio('ringing', 'src/audio/ringing.mp3');
  this.game.load.audio('music', 'src/audio/test.mp3');

  // Play ringing sound once loaded
  this.game.load.onLoadComplete.add(() => {
    if (this.game.cache.checkSoundKey('ringing')) {
      this.sound = this.sound.play('ringing');
    }
  }, this);

  this.game.load.start();
};

splash.prototype.update = function () {
  const self = this;

  if (fireButton.isDown || this.input.activePointer.isDown) {
    tween = this.add.tween(shops);

    try {
      tweenText.to({ x: -1440 }, 1000, 'Linear', true);
      tweenPhone.to({ x: -1440 }, 1000, 'Linear', true);
      tweenMessage.to({ x: -1440 }, 1000, 'Linear', true);
      tweenTitle.to({ x: -1440 }, 1000, 'Linear', true);
      tweenSplash.to({ x: -1440 }, 1000, 'Linear', true);
      tween.to({ x: -1440 }, 1000, 'Linear', true).onComplete.add(function () {
        self.game.state.start('game');
      });
    } catch (err) {
      self.game.state.start('game');
    }
  }
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
