var splash = {};
var fireButton;
var shops;
var text;
var tween;
var transitionSpeed = 2;
var style = {font: 'bold 32px monospace', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'};
splash.preload = function() {

};

splash.create = function() {
  this.starfield = splash.add.tileSprite( 0, 0, 1024, 768, 'starfield' );
  shops = splash.add.sprite( -100, 0, 'shop' );

  tween = splash.add.tween(shops);
  tween.to({x:-1240}, 2000, 'Linear', true);


  this.add.image(0,0,'splash-1');
  fireButton = splash.input.keyboard.addKey( Phaser.Keyboard.UP );
  text = splash.add.text( 350, 650, 'Click to start', style );
   splash.time.events.add( Phaser.Timer.SECOND * 3, addPhone, this );
   splash.time.events.add( Phaser.Timer.SECOND * 6, addMessage, this );
   splash.time.events.add( Phaser.Timer.SECOND * 6.5, addTitle, this );
};

splash.update = function() {
  if ( fireButton.isDown || splash.input.activePointer.isDown ) {
    // go to game
    this.game.state.start( 'game' );
  }
};

module.exports = splash; // export to app.js

// helper functions
function addPhone () {
  this.add.image( 325, 400, 'splash-phone');
}

function addMessage () {
    this.add.image( 25, 260, 'splash-message-box' );
}

function addTitle () {
    this.add.image( 175,50, 'splash-text' );
}

// function moveShops () {
//   console.log(shops.body);
//   // .body.velocity.x = -200;
// }