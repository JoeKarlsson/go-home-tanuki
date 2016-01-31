var splash = {};
var fireButton;
var style = {font: 'bold 32px monospace', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'};

splash.preload = function() {

};

splash.create = function() {
  this.starfield = splash.add.tileSprite( 0, 0, 1024, 768, 'starfield' );
  this.add.image(0,0,'splash-1');
  fireButton = splash.input.keyboard.addKey(Phaser.Keyboard.UP);
  var text = splash.add.text(350,650, 'Click to start', style);
   splash.time.events.add(Phaser.Timer.SECOND * 3, addPhone, this);
   splash.time.events.add(Phaser.Timer.SECOND * 6, addMessage, this);
   splash.time.events.add(Phaser.Timer.SECOND * 0.5, addTitle, this);

};

splash.update = function() {
  // go to game
  if ( fireButton.isDown || splash.input.activePointer.isDown) {
    this.game.state.start('game');
  }
};

module.exports = splash; // export to app.js

// helper functions
function addPhone () {
  this.add.image(325,400, 'splash-phone');
}

function addMessage () {
    this.add.image(25,260, 'splash-message-box');
}

function addTitle () {
    this.add.image(175,50, 'splash-text');
}