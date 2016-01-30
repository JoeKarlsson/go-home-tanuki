var preloader = {};

preloader.preload = function () {

  this.game.load.image('starfield', 'images/starfield.png');
  this.game.load.image('bullet', 'images/bullet.png');
  this.game.load.image('enemy-green', 'images/enemy-green.png');
  this.game.load.image('box1', 'images/GUI_Box_1.png');
  this.game.load.image('sakeSmall', 'images/Sake_Small_1.png');
  this.game.load.image('sakeLarge', 'images/Sake_Large_1.png');
  this.game.load.image('smallLeaf', 'images/Leaf_Small_1.png');
  this.game.load.image('drinkSmall', 'images/Drink_Small_1.png');
  this.game.load.image('ship', 'images/tanukifly1.png');
  this.game.load.image('tanuki2', 'images/tanukifly2.png');
  this.load.image('ground', 'images/ground.png');

  this.load.spritesheet('tanuki', 'images/tanukisheet.png', 115, 100, 2);


};

preloader.create = function () {
  this.game.state.start('game');


};

module.exports = preloader;
