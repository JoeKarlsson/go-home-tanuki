// Phaser is loaded globally via script tag

const game = {};
let starfield;
let player;

// Enhanced UI Styles
const UI_STYLES = {
  title: {
    font: 'bold 32px monospace',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3,
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  },
  score: {
    font: 'bold 24px monospace',
    fill: '#ffff00',
    stroke: '#000000',
    strokeThickness: 2
  },
  label: {
    font: 'bold 20px monospace',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2
  },
  value: {
    font: 'bold 24px monospace',
    fill: '#00ff00',
    stroke: '#000000',
    strokeThickness: 2
  },
  drunk: {
    font: 'bold 24px monospace',
    fill: '#ff6600',
    stroke: '#000000',
    strokeThickness: 2
  },
  achievement: {
    font: 'bold 18px monospace',
    fill: '#ff00ff',
    stroke: '#000000',
    strokeThickness: 2,
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  }
};

let cursors;
let fireButton;
let pauseButton;
let ground;
let ground2;
let leftClick;
let multiplier = 2;
let isDrunk = false;
let isPaused = false;
let pauseOverlay;
let pauseText;

let cloud1;
let cloud2;
let cloud3;
let rock1;
let rock2;

let lamp;
let tree;
let shop1;
let shop2;

// init score items
let drunkScore = 5;
let timeScore = 0;
let distanceScore = 0;
let comboMultiplier = 1;
let comboCount = 0;
let lastScore = 'Drunkness x Time';
let lastScoreText = lastScore;
let drunkMeter;
let time;
let distanceText;
let comboText;
let achievementText;
let comboResetTimer;

let largeSake;
let smallSake;

let lampSpeed = -200;
let groundSpeed = 2;
let skySpeed = 1.5;
let cloudSpeed = -425;

let defaultGravityForce = 3000; // default gravity to reset
let gravityForce = 3000; // sets gravity
let flapForce = -500; // controls amount of 'power' player flaps

let anchorB = 0.5; // rotational point for player
let anchorA = 0.5; // rotational point for player

let upAngle = -40; // how many degrees the player will rotate on click
let upAngleTime = 100; // how many seconds player will stay rotated in ms

// Roll animation variables
let isRolling = false;
let rollAnimation = null;
let rollSpeed = 0;
let rollDirection = 1; // 1 for right, -1 for left

let music;

// Particle systems
let sakeParticles;
let flapParticles;
let collisionParticles;
let dustParticles;

// Visual effects
let drunkOverlay;
let speedLines;
let playerTrail;

// Death screen variables
let isDeathScreen = false;
let deathScreenDelay = 2000; // 2 seconds delay before allowing restart
let deathScreenStartTime = 0;
let gameOverText;
let restartInstructionText;

game.create = function () {
  game.time.reset();

  // Game Music
  music = game.add.audio('music');
  music.play();

  // The scrolling starfield
  starfield = this.starfield = game.add.tileSprite(0, 0, 1024, 768, 'starfield');

  tree = game.add.group();
  tree.enableBody = true;
  tree.createMultiple(25, 'tree');
  tree.setAll('outOfBoundsKill', true);
  tree.setAll('checkWorldBounds', true);

  // init lamp obstacle
  lamp = game.add.group();
  lamp.enableBody = true;
  lamp.createMultiple(25, 'lamp');
  lamp.setAll('outOfBoundsKill', true);
  lamp.setAll('checkWorldBounds', true);

  // init shop2 background
  shop2 = game.add.group();
  shop2.enableBody = true;
  shop2.createMultiple(25, 'shop2');
  shop2.setAll('outOfBoundsKill', true);
  shop2.setAll('checkWorldBounds', true);

  // init shop1 background
  shop1 = game.add.group();
  shop1.enableBody = true;
  shop1.createMultiple(25, 'shop1');
  shop1.setAll('outOfBoundsKill', true);
  shop1.setAll('checkWorldBounds', true);

  // init cloud1 obstacle
  cloud1 = game.add.group();
  cloud1.enableBody = true;
  cloud1.createMultiple(25, 'cloud1');
  cloud1.setAll('outOfBoundsKill', true);
  cloud1.setAll('checkWorldBounds', true);

  // init cloud2 obstacle
  cloud2 = game.add.group();
  cloud2.enableBody = true;
  cloud2.createMultiple(25, 'cloud2');
  cloud2.setAll('outOfBoundsKill', true);
  cloud2.setAll('checkWorldBounds', true);

  // init cloud3 obstacle
  cloud3 = game.add.group();
  cloud3.enableBody = true;
  cloud3.createMultiple(25, 'cloud3');
  cloud3.setAll('outOfBoundsKill', true);
  cloud3.setAll('checkWorldBounds', true);

  // The player
  player = this.player = this.game.add.sprite(200, 300, 'ship');
  var fly = player.animations.add('fly');
  player.animations.play('fly', 2, true);

  // Add roll animation
  var roll = player.animations.add('roll', [0, 1], 8, true);

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.setTo(anchorA, anchorB);
  player.body.gravity.y = gravityForce;

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftClick = game.input.onDown.add(flap, player);

  // init small sake
  smallSake = game.add.group();
  smallSake.enableBody = true;
  smallSake.createMultiple(100, 'smallSake');
  smallSake.setAll('outOfBoundsKill', true);
  smallSake.setAll('checkWorldBounds', true);

  // init large sake
  largeSake = game.add.group();
  largeSake.enableBody = true;
  largeSake.createMultiple(100, 'largeSake');
  largeSake.setAll('outOfBoundsKill', true);
  largeSake.setAll('checkWorldBounds', true);

  // init rock1 obstacle
  rock1 = game.add.group();
  rock1.enableBody = true;
  rock1.createMultiple(25, 'rock1');
  rock1.setAll('outOfBoundsKill', true);
  rock1.setAll('checkWorldBounds', true);

  // init rock2 obstacle
  rock2 = game.add.group();
  rock2.enableBody = true;
  rock2.createMultiple(25, 'rock2');
  rock2.setAll('outOfBoundsKill', true);
  rock2.setAll('checkWorldBounds', true);

  // Create enhanced UI elements
  this.createUI();

  // Initialize particle systems
  this.createParticleSystems();

  // Initialize visual effects
  this.createVisualEffects();

  // set timer to decrease drunkness
  this.timer = game.time.events.loop(3000, soberUp, null, this);

  // the scrolling ground
  ground = this.ground = game.add.tileSprite(0, 656, 1024, 115, 'ground');
  ground.physicsType = Phaser.SPRITE;
  game.physics.enable(ground, Phaser.Physics.ARCADE);

  ground2 = this.ground2 = game.add.tileSprite(0, 623, 1024, 150, 'ground2');
  game.physics.enable(ground2, Phaser.Physics.ARCADE);

  // Randomly spawn obstacles
  this.timer = game.time.events.loop(3500, function () {
    cloudArray[game.rnd.integerInRange(0, 2)]();
  }, null, this);
  this.timer = game.time.events.loop(5000, function () {
    obstacleArray[game.rnd.integerInRange(0, 4)]();
  }, null, this);

  // Randomly generates background items
  this.timer = game.time.events.loop(game.rnd.integerInRange(3000, 7000), function () {
    backgroundArray[game.rnd.integerInRange(0, 3)]();
  }, null, this);
  this.timer = game.time.events.loop(game.rnd.integerInRange(1000, 17000), addTree, null, this);

  // Randomly generates sake
  this.timer = game.time.events.loop(2000, function () {
    sakeArray[game.rnd.integerInRange(0, 3)]();
  }, null, this);

}; // ******** end of game create **********

game.createUI = function () {
  // High Score section
  game.add.text(250, 20, 'HIGH SCORE:', UI_STYLES.label);
  lastScoreText = game.add.text(415, 20, lastScore, UI_STYLES.score);

  // Drunkness section with enhanced styling
  game.add.text(20, 20, 'DRUNKNESS:', UI_STYLES.label);
  drunkMeter = game.add.text(180, 20, drunkScore, UI_STYLES.drunk);

  // Time section
  game.add.text(20, 60, 'TIME:', UI_STYLES.label);
  time = game.add.text(110, 60, '0', UI_STYLES.value);

  // Distance section (new)
  game.add.text(20, 100, 'DISTANCE:', UI_STYLES.label);
  distanceText = game.add.text(150, 100, '0m', UI_STYLES.value);

  // Combo section (new)
  game.add.text(20, 140, 'COMBO:', UI_STYLES.label);
  comboText = game.add.text(120, 140, 'x1', UI_STYLES.score);

  // Achievement notification area
  achievementText = game.add.text(512, 100, '', UI_STYLES.achievement);
  achievementText.anchor.set(0.5);
  achievementText.visible = false;

  // Death screen UI elements
  gameOverText = game.add.text(512, 300, 'GAME OVER', {
    font: 'bold 48px monospace',
    fill: '#ff0000',
    stroke: '#000000',
    strokeThickness: 4,
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  });
  gameOverText.anchor.set(0.5);
  gameOverText.visible = false;

  restartInstructionText = game.add.text(512, 400, 'Press SPACEBAR to restart', {
    font: 'bold 24px monospace',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2,
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  });
  restartInstructionText.anchor.set(0.5);
  restartInstructionText.visible = false;
};

game.createParticleSystems = function () {
  // Sake collection particles (golden sparkles)
  sakeParticles = game.add.emitter(0, 0, 20);
  sakeParticles.makeParticles('smallSake', 0, 20, false, true);
  sakeParticles.setXSpeed(-100, 100);
  sakeParticles.setYSpeed(-150, -50);
  sakeParticles.setRotation(0, 360);
  sakeParticles.setAlpha(1, 0, 800);
  sakeParticles.setScale(0.3, 0.1, 0.3, 0.1, 800);

  // Flap particles (dust clouds) - using tint property instead of setTint
  flapParticles = game.add.emitter(0, 0, 15);
  flapParticles.makeParticles('smallSake', 0, 15, false, true);
  flapParticles.setXSpeed(-50, 50);
  flapParticles.setYSpeed(-20, 20);
  flapParticles.setRotation(0, 360);
  flapParticles.setAlpha(0.6, 0, 600);
  flapParticles.setScale(0.2, 0.05, 0.2, 0.05, 600);
  flapParticles.forEach(function (particle) {
    particle.tint = 0x888888; // Gray dust color
  });

  // Collision particles (red sparks) - using tint property instead of setTint
  collisionParticles = game.add.emitter(0, 0, 25);
  collisionParticles.makeParticles('smallSake', 0, 25, false, true);
  collisionParticles.setXSpeed(-200, 200);
  collisionParticles.setYSpeed(-200, 200);
  collisionParticles.setRotation(0, 360);
  collisionParticles.setAlpha(1, 0, 1000);
  collisionParticles.setScale(0.4, 0.1, 0.4, 0.1, 1000);
  collisionParticles.forEach(function (particle) {
    particle.tint = 0xff0000; // Red collision color
  });

  // Dust particles for ground rolling effects
  dustParticles = game.add.emitter(0, 0, 30);
  dustParticles.makeParticles('smallSake', 0, 30, false, true);
  dustParticles.setXSpeed(-80, 80);
  dustParticles.setYSpeed(-30, 10);
  dustParticles.setRotation(0, 360);
  dustParticles.setAlpha(0.8, 0, 1200);
  dustParticles.setScale(0.3, 0.05, 0.3, 0.05, 1200);
  dustParticles.forEach(function (particle) {
    particle.tint = 0x8B4513; // Brown dust color
  });
};

game.createVisualEffects = function () {
  // Drunk overlay effect
  drunkOverlay = game.add.graphics();
  drunkOverlay.beginFill(0xff0000, 0);
  drunkOverlay.drawRect(0, 0, 1024, 768);
  drunkOverlay.endFill();
  drunkOverlay.fixedToCamera = true;

  // Speed lines effect
  speedLines = game.add.group();
  for (let i = 0; i < 10; i++) {
    let line = game.add.graphics();
    line.lineStyle(2, 0xffffff, 0.5);
    line.moveTo(0, 0);
    line.lineTo(-50, 0);
    speedLines.add(line);
  }

  // Player trail effect
  playerTrail = game.add.graphics();
};

game.updateVisualEffects = function () {
  // Drunk overlay disabled - keeping other effects
  // drunkOverlay.clear();
  // drunkOverlay.beginFill(0xff0000, 0);
  // drunkOverlay.drawRect(0, 0, 1024, 768);
  // drunkOverlay.endFill();

  // Update speed lines based on movement speed
  if (Math.abs(player.body.velocity.x) > 100 || Math.abs(player.body.velocity.y) > 100) {
    speedLines.forEach(function (line) {
      line.x = game.rnd.integerInRange(0, 1024);
      line.y = game.rnd.integerInRange(0, 768);
      line.alpha = 0.5;
    });
  } else {
    speedLines.forEach(function (line) {
      line.alpha = 0;
    });
  }

  // Update player trail
  playerTrail.clear();
  playerTrail.lineStyle(3, 0xffffff, 0.3);
  playerTrail.moveTo(player.x - 20, player.y);
  playerTrail.lineTo(player.x - 40, player.y);
};

game.update = function () {
  breathalizer(drunkScore);
  this.updateVisualEffects();

  // Handle death screen logic
  if (player.alive === false && !isDeathScreen) {
    showDeathScreen();
  }

  // Check for spacebar restart during death screen
  if (isDeathScreen && fireButton.isDown) {
    const currentTime = game.time.now;
    if (currentTime - deathScreenStartTime >= deathScreenDelay) {
      restartGame();
    }
  }

  if (isDrunk === true) {
    skySpeed = 10;
    lampSpeed = -2000;
    multiplier = 1;
    cloudSpeed = -850;
    gravityForce = 5000;
  }

  if (isDrunk === false) {
    skySpeed = 1.5;
    lampSpeed = -200;
    multiplier = 2;
    cloudSpeed = -550;
    defaultGravityForce = 3000;
  }

  // Check for ground collision and handle roll animation
  game.physics.arcade.collide(player, ground, onGroundCollision, null, this);

  // scroll the ground
  ground.tilePosition.x -= groundSpeed;
  game.physics.arcade.enableBody(ground);
  ground.body.allowGravity = false;
  ground.body.checkCollision = true;
  ground.body.allowGravity = false;
  ground.body.immovable = true;
  ground.body.moves = false;

  ground2.tilePosition.x -= groundSpeed;
  game.physics.arcade.enableBody(ground2);
  ground2.body.allowGravity = false;
  // ground2.body.checkCollision = true;
  ground2.body.allowGravity = false;
  // ground2.body.immovable = true;
  ground2.body.moves = false;

  // Scroll the background
  starfield.tilePosition.x -= skySpeed;

  // player can collide with upper and lower bounds
  player.body.collideWorldBounds = true;

  // Handle roll animation
  if (isRolling) {
    updateRollAnimation();
  } else {
    // if player is turned up, player will correctly orient down with gravity
    if (player.angle < 90) {
      player.angle += 2.5;
    }
  }

  // flaps with spacebar is pressed or mouse is clicked
  if (fireButton.isDown || game.input.activePointer.isDown) {
    flap();
  }

  if (player.body.y > 500) {
    player.angle += 0.9;
  }

  // game.physics.arcade.overlap(player,lamp,death,null,this);
  game.physics.arcade.overlap(player, cloud1, death, null, this);
  game.physics.arcade.overlap(player, cloud2, death, null, this);
  game.physics.arcade.overlap(player, cloud3, death, null, this);
  game.physics.arcade.overlap(player, rock1, death, null, this);
  game.physics.arcade.overlap(player, rock2, death, null, this);


  game.physics.arcade.overlap(player, smallSake, collectSake1, null, this);
  game.physics.arcade.overlap(player, largeSake, collectSake3, null, this);

  // Update time and distance
  time.text = Math.floor(this.game.time.totalElapsedSeconds());
  timeScore = Math.floor(this.game.time.totalElapsedSeconds());

  // Update distance based on ground scroll
  distanceScore += groundSpeed;
  distanceText.text = Math.floor(distanceScore / 10) + 'm';

  // Update combo display
  comboText.text = 'x' + comboMultiplier;

}; // ******** end of game create **********

function death() {
  if (player.alive === false) {
    return;
  }

  // Trigger collision particles
  collisionParticles.x = player.x;
  collisionParticles.y = player.y;
  collisionParticles.start(true, 1000, null, 15);

  // Screen shake effect (Phaser 2.6.2 compatible)
  // game.camera.flash(0xff0000, 200); // Not available in Phaser 2.6.2
  // game.camera.fade(0x000000, 100); // Not available in Phaser 2.6.2

  // Slow motion effect
  game.time.timeScale = 0.3;
  game.time.events.add(1000, function () {
    game.time.timeScale = 1.0;
  }, this);

  player.alive = false;
  game.time.events.remove(this.timer);
  lamp.forEachAlive(function (lamp) {
    lamp.body.velocity.x = 0;
  }, this);
  starfield.tilePosition.x = 0;
  ground.tilePosition.x = 0;
  // drunkScore = 5;
  gravityForce = defaultGravityForce; // sets gravity
  drunkScore = 10;

  removeMusic();
}

// adds objects into the world
function addLamp() {
  var item = lamp.getFirstExists(false);
  item.reset(1023, 467);
  item.body.velocity.x = lampSpeed / 2;
  item.body.immovable = true;
}

function addLeaf() {
  var item = leaf.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(25, 300));
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

// adds sake objects
function addSmallSake() {
  var item = smallSake.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(50, 500));
  item.body.velocity.x = -200;
  item.body.immovable = true;
}

function addLargeSake() {
  var item = largeSake.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(50, 500));
  item.body.velocity.x = -200;
  item.body.immovable = true;
}

function addRock1() {
  var item = rock1.getFirstExists(false);
  item.reset(1023, 630);
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

function addRock2() {
  var item = rock2.getFirstExists(false);
  item.reset(1023, 630);
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

function addTree() {
  var item = tree.getFirstExists(false);
  item.reset(1023, 376);
  item.body.velocity.x = lampSpeed / 2;
  item.body.immovable = true;
}

function addShop2() {
  var item = shop2.getFirstExists(false);
  item.reset(1023, 426);
  item.body.velocity.x = lampSpeed / 2;
  item.body.immovable = true;
}

function addShop1() {
  var item = shop1.getFirstExists(false);
  item.reset(1023, 156);
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

function addCloud1() {
  var item = cloud1.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(0, 475));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

function addCloud2() {
  var item = cloud2.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(0, 475));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

function addCloud3() {
  var item = cloud3.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(0, 500));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

// sake collection functions
function collectSake1(player, sake) {
  sake.kill();

  // Trigger collection particles
  sakeParticles.x = sake.x;
  sakeParticles.y = sake.y;
  sakeParticles.start(true, 800, null, 8);

  // Camera flash effect (Phaser 2.6.2 compatible)
  // game.camera.flash(0xffff00, 150); // Not available in Phaser 2.6.2

  drink(1);
  updateCombo();
}

function collectSake3(player, sake) {
  sake.kill();

  // Trigger collection particles
  sakeParticles.x = sake.x;
  sakeParticles.y = sake.y;
  sakeParticles.start(true, 800, null, 12);

  // Stronger camera flash effect for large sake (Phaser 2.6.2 compatible)
  // game.camera.flash(0xffaa00, 200); // Not available in Phaser 2.6.2

  drink(3);
  updateCombo();
}

function updateCombo() {
  comboCount++;
  comboMultiplier = Math.min(Math.floor(comboCount / 3) + 1, 5); // Max 5x combo

  // Show achievement for high combos
  if (comboCount % 10 === 0 && comboCount > 0) {
    showAchievement(`COMBO x${comboMultiplier}!`);
  }

  // Show achievement for distance milestones
  if (Math.floor(distanceScore / 10) % 100 === 0 && Math.floor(distanceScore / 10) > 0) {
    showAchievement(`${Math.floor(distanceScore / 10)}m REACHED!`);
  }

  // Show achievement for time milestones
  if (timeScore % 30 === 0 && timeScore > 0) {
    showAchievement(`${timeScore}s SURVIVED!`);
  }

  // Reset combo after 5 seconds of no collection
  game.time.events.remove(comboResetTimer);
  comboResetTimer = game.time.events.add(5000, resetCombo, null, game);
}

function drink(amount) {
  if (!(drunkScore > 10)) {
    drunkScore += amount;
    gravityForce += amount * (100);
    player.body.gravity.y = gravityForce;
    drunkMeter.text = drunkScore;
  }
}

function soberUp() {
  if (drunkScore === 0) {
    drunkScore = 0;
  }
  if (drunkScore > 0) {
    drunkScore--;
    gravityForce -= 100;
    player.body.gravity.y = gravityForce;
    drunkMeter.text = drunkScore;
  }
}

function showDeathScreen() {
  isDeathScreen = true;
  deathScreenStartTime = game.time.now;

  // Show death screen UI
  gameOverText.visible = true;
  restartInstructionText.visible = true;

  // Animate the game over text
  gameOverText.alpha = 0;
  game.add.tween(gameOverText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

  // Make restart instruction blink
  game.add.tween(restartInstructionText).to({ alpha: 0.3 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
}

function restartGame() {
  // Hide death screen UI
  gameOverText.visible = false;
  restartInstructionText.visible = false;
  isDeathScreen = false;

  finalScore(timeScore, drunkScore);
  isDrunk = false;
  drunkScore = 5;
  game.time.reset();
  game.state.start('game');
}

function finalScore() {
  // Enhanced scoring system
  const baseScore = drunkScore * timeScore;
  const distanceBonus = Math.floor(distanceScore / 10) * 10;
  const comboBonus = comboCount * comboMultiplier * 5;
  const totalScore = baseScore + distanceBonus + comboBonus;

  if ((parseInt(lastScore) < totalScore) || typeof lastScore !== 'number') {
    lastScore = totalScore;
    showAchievement('NEW HIGH SCORE!');
  }
}

function breathalizer(drunkX) {
  if (drunkX >= 10) {
    isDrunk = true;
  }
}

function removeMusic() {
  music.destroy();
}

function resetCombo() {
  comboCount = 0;
  comboMultiplier = 1;
}

function showAchievement(text) {
  achievementText.text = text;
  achievementText.visible = true;
  achievementText.alpha = 1;

  // Animate achievement text
  game.add.tween(achievementText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true).onComplete.add(() => {
    achievementText.visible = false;
  });
}

// Arrays defined after functions are declared
let cloudArray;
let obstacleArray;
let backgroundArray;
let sakeArray;

// Initialize arrays with function references
function initArrays() {
  cloudArray = [addCloud1, addCloud2, addCloud3];
  obstacleArray = [addCloud1, addCloud2, addCloud3, addRock1, addRock2];
  backgroundArray = [addLamp, addTree, addShop1, addShop2];
  sakeArray = [addLargeSake, addSmallSake, addSmallSake, addSmallSake];
}

// Call initialization before game create runs
initArrays();

// Roll animation functions
function onGroundCollision(player, ground) {
  if (!isRolling && player.body.velocity.y > 0) {
    startRollAnimation();
  }
}

function startRollAnimation() {
  isRolling = true;
  player.animations.play('roll', 8, true);

  // Set initial roll speed based on horizontal velocity
  rollSpeed = Math.abs(player.body.velocity.x) * 0.3;
  if (rollSpeed < 50) rollSpeed = 50; // Minimum roll speed

  // Determine roll direction based on horizontal velocity
  rollDirection = player.body.velocity.x > 0 ? 1 : -1;

  // Stop vertical movement
  player.body.velocity.y = 0;
  player.body.gravity.y = 0;

  // Emit dust particles at ground level
  dustParticles.x = player.x;
  dustParticles.y = ground.y - 20; // Position dust slightly above ground
  dustParticles.start(true, 800, null, 15); // Emit 15 particles over 800ms
}

function updateRollAnimation() {
  // Apply horizontal movement for rolling
  player.body.velocity.x = rollSpeed * rollDirection;

  // Gradually slow down the roll
  rollSpeed *= 0.98;

  // Rotate the player to simulate rolling
  player.angle += rollDirection * 10;

  // Emit continuous dust particles while rolling (every few frames)
  if (game.time.now % 3 === 0) { // Emit dust every 3 frames
    dustParticles.x = player.x;
    dustParticles.y = ground.y - 20; // Position dust slightly above ground
    dustParticles.start(true, 400, null, 3); // Emit 3 particles over 400ms
  }

  // Stop rolling if speed is too low
  if (rollSpeed < 10) {
    stopRollAnimation();
  }
}

function stopRollAnimation() {
  isRolling = false;
  player.animations.play('fly', 2, true);
  player.body.gravity.y = gravityForce;
  player.angle = 0;
  rollSpeed = 0;
}

// Modified flap function to handle roll animation
function flap() {
  // If rolling, stop roll and start flying
  if (isRolling) {
    stopRollAnimation();
  }

  player.body.velocity.y = flapForce;
  game.add.tween(player).to({ angle: upAngle }, upAngleTime).start();

  // Trigger flap particles
  flapParticles.x = player.x;
  flapParticles.y = player.y + 20;
  flapParticles.start(true, 600, null, 5);
}

export default game;
