// Phaser is loaded globally via script tag

const load = function () { };
let plaque;
let progressText;
let splashAssetsLoaded = false;

load.prototype.preload = function () {
  // Load splash assets here instead of in preloader
  // Note: Audio will be loaded after user interaction to avoid AudioContext issues
  this.game.load.image('splash-1', 'images/splash/splash-main.webp');
  this.game.load.image('shop', 'images/splash/all-shops.webp');
  this.game.load.image('splash-text', 'images/splash/go-home-tanuki-text.webp');
  this.game.load.image('splash-phone', 'images/splash/phone.webp');
  this.game.load.image('youdrunk', 'images/splash/youredrunk.webp');
  this.game.load.image('splash-message-box', 'images/splash/phone-message.webp');

  // Start loading
  this.game.load.start();
};

load.prototype.create = function () {
  // Center the plaque
  plaque = this.add.image(512, 384, 'plaque');
  plaque.anchor.set(0.5);

  // Enhanced loading UI
  this.createLoadingUI();

  // Check if assets are loaded
  this.checkLoadingProgress();
};

load.prototype.createLoadingUI = function () {
  // Loading tips array
  this.loadingTips = [
    "Tip: Collect sake to increase your drunkness!",
    "Tip: Avoid obstacles like clouds and rocks!",
    "Tip: The more drunk you are, the harder it gets!",
    "Tip: Try to stay alive as long as possible!",
    "Tip: Click to flap your wings!"
  ];

  // Progress bar background (centered, much lower on screen)
  this.progressBarBg = this.add.graphics();
  this.progressBarBg.lineStyle(4, 0xffffff, 1);
  this.progressBarBg.drawRect(312, 700, 400, 20); // Moved much lower

  // Progress bar fill
  this.progressBar = this.add.graphics();

  // Progress text (centered, much lower)
  progressText = this.add.text(512, 660, 'Loading splash assets...', {
    font: 'bold 20px monospace',
    fill: '#ffffff',
    align: 'center',
    stroke: '#000033',
    strokeThickness: 3
  });
  progressText.anchor.set(0.5);

  // Loading tip text (centered, much lower)
  this.tipText = this.add.text(512, 750, this.loadingTips[0], {
    font: '16px monospace',
    fill: '#ffff00',
    align: 'center',
    stroke: '#000033',
    strokeThickness: 2
  });
  this.tipText.anchor.set(0.5);

  // Animated loading dots (centered, much lower)
  this.loadingDots = this.add.text(512, 780, '...', {
    font: 'bold 28px monospace',
    fill: '#00ff00',
    align: 'center',
    stroke: '#000033',
    strokeThickness: 2
  });
  this.loadingDots.anchor.set(0.5);

  // Animate loading dots
  this.add.tween(this.loadingDots).to({ alpha: 0.3 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

  // Rotate tip text every 2 seconds
  this.tipRotationTimer = this.time.events.loop(2000, this.rotateTip, this);

};

load.prototype.checkLoadingProgress = function () {
  // Check if we have all splash assets (excluding audio for now)
  const splashKeys = ['splash-1', 'shop', 'splash-text', 'splash-phone', 'youdrunk', 'splash-message-box'];
  const loadedCount = splashKeys.filter(key => this.game.cache.checkImageKey(key)).length;
  const totalAssets = splashKeys.length;
  const percentage = Math.round((loadedCount / totalAssets) * 100);

  // Update progress text and bar
  progressText.text = `Loading splash assets... ${percentage}%`;
  this.updateProgressBar(percentage);

  if (loadedCount === totalAssets && !splashAssetsLoaded) {
    splashAssetsLoaded = true;
    progressText.text = 'Loading complete!';
    this.updateProgressBar(100);

    // Stop tip rotation
    this.time.events.remove(this.tipRotationTimer);

    // Proceed to splash screen
    this.time.events.add(Phaser.Timer.SECOND * 0.5, this.checkmarkFunc, this);
    this.time.events.add(Phaser.Timer.SECOND * 1, this.checkmarkFunc2, this);
    this.time.events.add(Phaser.Timer.SECOND * 1.5, this.underlineFunc, this);
    this.time.events.add(Phaser.Timer.SECOND * 2, this.loadSplash, this);
  } else if (loadedCount < totalAssets) {
    // Check again in 100ms
    this.time.events.add(Phaser.Timer.SECOND * 0.1, this.checkLoadingProgress, this);
  }
};

load.prototype.updateProgressBar = function (percentage) {
  this.progressBar.clear();
  this.progressBar.beginFill(0xff0000, 1);
  this.progressBar.drawRect(314, 702, (396 * percentage / 100), 16);
  this.progressBar.endFill();
};

load.prototype.rotateTip = function () {
  const currentIndex = this.loadingTips.indexOf(this.tipText.text);
  const nextIndex = (currentIndex + 1) % this.loadingTips.length;

  // Fade out current tip
  this.add.tween(this.tipText).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true).onComplete.add(() => {
    this.tipText.text = this.loadingTips[nextIndex];
    // Fade in new tip
    this.add.tween(this.tipText).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
  });
};

load.prototype.update = function () {
  // Background preload gameplay assets
  if (!this.gameplayAssetsStarted) {
    this.gameplayAssetsStarted = true;
    this.preloadGameplayAssets();
  }
};

load.prototype.preloadGameplayAssets = function () {
  // Load gameplay assets in background (excluding audio to avoid AudioContext issues)
  this.game.load.image('ground2', 'images/grasstile_dark.webp');
  this.game.load.image('starfield', 'images/starfield.webp');
  this.game.load.image('seat', 'images/Seat_Large_1.webp');
  this.game.load.image('box1', 'images/GUI_Box_1.webp');
  this.game.load.image('chatBox', 'images/splash/Chat_phone_1.webp');
  this.game.load.image('rock1', 'images/Rock_Large_1.webp');
  this.game.load.image('rock2', 'images/Rock_Large_2.webp');
  this.game.load.image('lamp', 'images/Lamp_Large_1.webp');
  this.game.load.image('tree', 'images/tree-blackout.webp');
  this.game.load.image('shop1', 'images/shoptrio1.webp');
  this.game.load.image('shop2', 'images/shoptrio1-desaturated.webp');
  this.game.load.image('drinkSmall', 'images/Drink_Small_1.webp');
  this.game.load.image('smallSake', 'images/Sake_Small_1.webp');
  this.game.load.image('largeSake', 'images/Sake_Large_1.webp');
  this.game.load.image('tanuki2', 'images/tanukifly2.webp');

  this.game.load.start();
};

// helper functions
load.prototype.checkmarkFunc = function () {
  this.add.image(350, 260, 'checkmark');
};

load.prototype.checkmarkFunc2 = function () {
  this.add.image(350, 360, 'checkmark');
};

load.prototype.underlineFunc = function () {
  this.add.image(350, 525, 'underline');
};


load.prototype.loadSplash = function () {
  this.game.state.start('splash');
};

export default load;
