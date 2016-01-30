var splash = {};
var fireButton;

splash.preload = function() {

};

splash.create = function() {
  this.add.image(0,0,'splash-2');
  fireButton = splash.input.keyboard.addKey(Phaser.Keyboard.UP);
  var style = {font: 'bold 32px monospace', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'};
  var text = splash.add.text(350,650, 'Click to start', style);
   splash.time.events.add(Phaser.Timer.SECOND * 3, addPhone, this);
  };
}

splash.update = function() {
  // go to game
  if ( fireButton.isDown || splash.input.activePointer.isDown) {
    this.game.state.start('game');
  }

module.exports = splash; // export to app.js
function addPhone () {
  this.add.image(325,400, 'splash-phone');
}

// to do: add script to index page?