var splash = {}; // corina is not entirely sure this is right
// var cursors;
var fireButton;
// var leftClick;

splash.preload = function() {

};

splash.create = function() {
  this.add.image(0,0,'splash-1');
  fireButton = splash.input.keyboard.addKey(Phaser.Keyboard.UP);
};

splash.update = function() {
  if ( fireButton.isDown || splash.input.activePointer.isDown) {
    this.game.state.start('game');
    }
};

// go to game

module.exports = splash; // export to app.js


// to do: add script to index page?