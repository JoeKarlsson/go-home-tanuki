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
  this.sound = this.sound.play('ringing');
  this.starfield = this.add.tileSprite(0, 0, 1024, 768, 'starfield');
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