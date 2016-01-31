var preloader = {};

preloader.preload = function () {

  this.load.image('ground', 'images/ground.png');
  this.game.load.image('starfield', 'images/starfield.png');

  this.game.load.image('seat', 'images/Seat_Large_1.png');
  // this.game.load.image('shop1', 'images/Shop_Large_1.png');
  // this.game.load.image('shop2', 'images/Shop_Large_2.png');

  this.game.load.image('box1', 'images/GUI_Box_1.png');
  this.game.load.image('chatBox', 'images/Chat_phone_1.png');

  this.game.load.image('rock1', 'images/Rock_Large_1.png');
  this.game.load.image('rock2', 'images/Rock_Large_2.png');

  this.game.load.image('lamp', 'images/Lamp_Large_1.png');
  this.game.load.image('tree', 'images/tree-blackout.png');
  this.game.load.image('shop1', 'images/shoptrio1.png');
  this.game.load.image('shop2', 'images/shoptrio1-desaturated.png');

  this.game.load.image('drinkSmall', 'images/Drink_Small_1.png');
  this.game.load.image('smallSake', 'images/Sake_Small_1.png');
  this.game.load.image('largeSake', 'images/Sake_Large_1.png');
  this.game.load.image('cloud1', 'images/cloud1.png');
  this.game.load.image('cloud2', 'images/cloud2.png');
  this.game.load.image('cloud3', 'images/cloud3.png');
  // game music
  this.game.load.audio('music', 'audio/test.mp3');


  // this.game.load.image('ship', 'images/tanukifly1.png');
  this.game.load.image('tanuki2', 'images/tanukifly2.png');
  this.load.spritesheet('ship', 'images/tanukisprite_115_100.png', 115, 100, 2);

  // for splash state
  this.game.load.image('splash-1', 'images/splash/splash-main.png');
  this.game.load.image('splash-text', 'images/splash/go-home-tanuki-text.png');
  this.game.load.image('splash-phone', 'images/splash/phone.png');
  this.game.load.image('splash-message-box', 'images/splash/phone-message.png');

};


// go to splash screen
preloader.create = function () {
  this.game.state.start('splash');
};

module.exports = preloader;
