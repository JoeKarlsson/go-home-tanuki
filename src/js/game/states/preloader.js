var preloader = {};

preloader.preload = function () {

  this.load.image('ground', 'images/ground.png');
  this.game.load.image('starfield', 'images/starfield.png');

  this.game.load.image('seat', 'images/Seat_Large_1.png');
  this.game.load.image('shop1', 'images/Shop_Large_1.png');
  this.game.load.image('shop2', 'images/Shop_Large_2.png');

  this.game.load.image('box1', 'images/GUI_Box_1.png');
  this.game.load.image('chatBox', 'images/Chat_phone_1.png');

  this.game.load.image('rock', 'images/Rock_Large_1.png');
  this.game.load.image('rock2', 'images/Rock_Large_2.png');
  this.game.load.image('lamp', 'images/Lamp_Large_1.png');

  this.game.load.image('drinkSmall', 'images/Drink_Small_1.png');
  this.game.load.image('smallSake', 'images/Sake_Small_1.png');
  this.game.load.image('largeSake', 'images/Sake_Large_1.png');
  this.game.load.image('leaf', 'images/Leaf_Small_1.png');

  this.game.load.image('ship', 'images/tanukifly1.png');
  this.game.load.image('tanuki2', 'images/tanukifly2.png');
  // this.load.spritesheet('tanuki', 'images/tanukisheet.png', 115, 100, 2);

};

preloader.create = function () {
  this.game.state.start('game');


};

module.exports = preloader;
