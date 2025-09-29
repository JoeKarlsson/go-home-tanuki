const preloader = {};

preloader.preload = function () {
  this.load.image('ground', 'src/images/ground.png');
  this.load.image('ground2', 'src/images/grasstile_dark.png');
  this.game.load.image('starfield', 'src/images/starfield.png');

  this.game.load.image('seat', 'src/images/Seat_Large_1.png');

  this.game.load.image('box1', 'src/images/GUI_Box_1.png');
  this.game.load.image('chatBox', 'src/images/splash/Chat_phone_1.png');

  this.game.load.image('rock1', 'src/images/Rock_Large_1.png');
  this.game.load.image('rock2', 'src/images/Rock_Large_2.png');

  this.game.load.image('lamp', 'src/images/Lamp_Large_1.png');
  this.game.load.image('tree', 'src/images/tree-blackout.png');
  this.game.load.image('shop1', 'src/images/shoptrio1.png');
  this.game.load.image('shop2', 'src/images/shoptrio1-desaturated.png');

  this.game.load.image('drinkSmall', 'src/images/Drink_Small_1.png');
  this.game.load.image('smallSake', 'src/images/Sake_Small_1.png');
  this.game.load.image('largeSake', 'src/images/Sake_Large_1.png');
  this.game.load.image('cloud1', 'src/images/cloud1.png');
  this.game.load.image('cloud2', 'src/images/cloud2.png');
  this.game.load.image('cloud3', 'src/images/cloud3.png');

  // game music
  this.game.load.audio('music', 'src/audio/test.mp3');

  this.game.load.image('tanuki2', 'src/images/tanukifly2.png');
  this.load.spritesheet('ship', 'src/images/tanukisprite_115_100.png', 115, 100, 2);

  // for splash state
  this.game.load.audio('ringing', 'src/audio/ringing.mp3');
  this.game.load.image('splash-1', 'src/images/splash/splash-main.png');
  this.game.load.image('shop', 'src/images/splash/all-shops.png');
  this.game.load.image('splash-text', 'src/images/splash/go-home-tanuki-text.png');
  this.game.load.image('splash-phone', 'src/images/splash/phone.png');
  this.game.load.image('youdrunk', 'src/images/splash/youredrunk.png');
  this.game.load.image('splash-message-box', 'src/images/splash/phone-message.png');

  // for load state
  this.game.load.image('plaque', 'src/images/load/load-list.png');
  this.game.load.image('checkmark', 'src/images/load/checkmark.png');
  this.game.load.image('underline', 'src/images/load/underline.png');
};

// go to splash screen
preloader.create = function () {
  this.game.state.start('load');
};

export default preloader;
