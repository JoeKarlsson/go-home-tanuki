const preloader = {};

preloader.preload = function () {
  // Only load critical assets needed for immediate gameplay
  // This reduces initial load from ~47 assets to ~8 critical ones

  // Essential gameplay assets (highest priority)
  this.load.image('ground', 'images/ground.webp');
  this.load.spritesheet('ship', 'images/tanukisprite_115_100.webp', 115, 100, 2);
  // Load roll animation spritesheet (using existing tanuki flying sprites)
  this.load.spritesheet('tanukiRoll', 'images/tanukisprite_115_100.webp', 115, 100, 2);
  this.game.load.image('cloud1', 'images/cloud1.webp');
  this.game.load.image('cloud2', 'images/cloud2.webp');
  this.game.load.image('cloud3', 'images/cloud3.webp');

  // Load state assets (needed immediately)
  this.game.load.image('plaque', 'images/load/load-list.webp');
  this.game.load.image('checkmark', 'images/load/checkmark.webp');
  this.game.load.image('underline', 'images/load/underline.webp');

  // Start loading immediately
  this.game.load.start();
};

// go to splash screen
preloader.create = function () {
  this.game.state.start('load');
};

export default preloader;
