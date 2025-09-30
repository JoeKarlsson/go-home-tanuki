const preloader = {};

preloader.preload = function () {
  // Only load critical assets needed for immediate gameplay
  // This reduces initial load from ~47 assets to ~8 critical ones

  // Essential gameplay assets (highest priority)
  this.load.image('ground', 'src/images/ground.png');
  this.load.spritesheet('ship', 'src/images/tanukisprite_115_100.png', 115, 100, 2);
  // Load roll animation spritesheet (using existing tanuki flying sprites)
  this.load.spritesheet('tanukiRoll', 'src/images/tanukisprite_115_100.png', 115, 100, 2);
  this.game.load.image('cloud1', 'src/images/cloud1.png');
  this.game.load.image('cloud2', 'src/images/cloud2.png');
  this.game.load.image('cloud3', 'src/images/cloud3.png');

  // Load state assets (needed immediately)
  this.game.load.image('plaque', 'src/images/load/load-list.png');
  this.game.load.image('checkmark', 'src/images/load/checkmark.png');
  this.game.load.image('underline', 'src/images/load/underline.png');

  // Start loading immediately
  this.game.load.start();
};

// go to splash screen
preloader.create = function () {
  this.game.state.start('load');
};

export default preloader;
