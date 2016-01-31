var splash = function  () {
  
};

var fireButton;
var shops;
var text;
var phone;
var message;
var title;
var tanuki;
var tween;
var transitionSpeed = 2;
var style = {font: 'bold 32px monospace', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'};
splash.prototype.preload = function() {

};

splash.prototype.create = function() {
  this.starfield = this.add.tileSprite( 0, 0, 1024, 768, 'starfield' );
  shops = this.add.sprite( -100, 0, 'shop' );


  tanuki = this.add.image(0,0,'splash-1');
  fireButton = this.input.keyboard.addKey( Phaser.Keyboard.UP );
  text = this.add.text( 350, 650, 'Click to start', style );
   this.time.events.add( Phaser.Timer.SECOND * 3, this.addPhone, this );
   this.time.events.add( Phaser.Timer.SECOND * 6, this.addMessage, this );
   this.time.events.add( Phaser.Timer.SECOND * 6.5, this.addTitle, this );
};

splash.prototype.update = function() {
  var self = this;
  if ( fireButton.isDown || this.input.activePointer.isDown ) {
    tween = this.add.tween(shops);
    var tweenText = this.add.tween(text);
    var tweenPhone = this.add.tween(self.addPhone);
    var tweenMessage = this.add.tween('splash-message-box');
    var tweenTitle = this.add.tween('splash-text');
    var tweenSplash = this.add.tween(tanuki)

    tweenText.to({x:-300}, 1000, 'Linear', true);
    tweenPhone.to({x:-300}, 1000, 'Linear', true);
    tweenMessage.to({x:-300}, 1000, 'Linear', true);
    tweenTitle.to({x:-300}, 1000, 'Linear', true);
    tweenSplash.to({x:-1400}, 1000, 'Linear', true);
    tween.to({x:-1440}, 1000, 'Linear', true).onComplete.add(function () {
      console.log('game');
      self.game.state.start('game');
    });
    // go to game
    // this.game.state.start( 'game' );
  }
};

module.exports = splash; // export to app.js

// helper functions
// 
// function gameStart () {
//   this.game.state.start('game');
// }

splash.prototype.addPhone = function () {
  this.add.image( 325, 400, 'splash-phone');
}

splash.prototype.addMessage = function () {
    this.add.image( 25, 260, 'splash-message-box' );
}

splash.prototype.addTitle = function () {
    this.add.image( 175,50, 'splash-text' );
}

// function moveShops () {
//   console.log(shops.body);
//   // .body.velocity.x = -200;
// }