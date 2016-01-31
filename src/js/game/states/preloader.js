var preloader = {};

preloader.preload = function () {

  this.load.image('ground', 'images/ground.png');
  this.game.load.image('starfield', 'images/starfield.png');

  this.game.load.image('seat', 'images/Seat_Large_1.png');
  this.game.load.image('shop1', 'images/splash/Shop_Large_1.png');
  this.game.load.image('shop2', 'images/splash/Shop_Large_2.png');

  this.game.load.image('box1', 'images/GUI_Box_1.png');
  this.game.load.image('chatBox', 'images/splash/Chat_phone_1.png');

  this.game.load.image('rock1', 'images/Rock_Large_1.png');
  this.game.load.image('rock2', 'images/Rock_Large_2.png');

  this.game.load.image('drinkSmall', 'images/Drink_Small_1.png');
  this.game.load.image('sakeSmall', 'images/Sake_Small_1.png');
  this.game.load.image('sakeLarge', 'images/Sake_Large_1.png');
  this.game.load.image('smallLeaf', 'images/Leaf_Small_1.png');

  this.game.load.image('ship', 'images/tanukifly1.png');
  this.game.load.image('tanuki2', 'images/tanukifly2.png');
  // this.load.spritesheet('tanuki', 'images/tanukisheet.png', 115, 100, 2);

  // for splash state
  this.game.load.image('splash-1', 'images/splash/splash-main.png');
  this.game.load.image('shop', 'images/splash/all-shops.png');
  this.game.load.image('splash-text', 'images/splash/go-home-tanuki-text.png');
  this.game.load.image('splash-phone', 'images/splash/phone.png');
  this.game.load.image('splash-message-box', 'images/splash/phone-message.png');

  // for load state
  this.game.load.image('plaque', 'images/load/load-list.png');
  this.game.load.image('checkmark', 'images/load/checkmark.png');
  this.game.load.image('underline', 'images/load/underline.png');

};


// go to splash screen
preloader.create = function () {
  this.game.state.start('load');
};

module.exports = preloader;
