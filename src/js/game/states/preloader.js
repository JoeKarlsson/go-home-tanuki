var preloader = {};

preloader.preload = function () {
  this.game.load.image('starfield', 'images/starfield.png');
  this.game.load.image('ship', 'images/player.png');
  this.game.load.image('bullet', 'images/bullet.png');
  this.game.load.image('enemy-green', 'images/enemy-green.png')

};

preloader.create = function () {
  this.game.state.start('game');


};

module.exports = preloader;
