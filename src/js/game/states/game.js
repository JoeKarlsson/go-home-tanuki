var game = {};
var starfield;
var player;

var cursors;
var fireButton;
var ground;
var ground2;
var leftClick;
var multiplier = 2;
var isDrunk = false;


var cloud1;
var cloud2;
var cloud3;
var rock1;
var rock2;
var cloudArray = [addCloud1, addCloud2, addCloud3];
var obstacleArray = [addCloud1, addCloud2, addCloud3, addRock1, addRock2];

var lamp;
var tree;
var shop1;
var shop2;
var backgroundArray = [addLamp, addTree, addShop1, addShop2];

// init score items
var drunkScore = 5;
var timeScore = 0;
var lastScore = 'Drunkness x Time';
var lastScoreText = lastScore;

var largeSake;
var smallSake;
var sakeArray = [addLargeSake, addSmallSake, addSmallSake, addSmallSake];

var lampSpeed = -200;
var groundSpeed = 2;
var skySpeed = 1.5;
var cloudSpeed = -425;

// var skySpeed = 5.5;

var defaultGravityForce = 3000; // default gravity to reset
var gravityForce = 3000; // sets gravity
var flapForce = -500; // controls amount of 'power' player flaps

var anchorB = 0.5; // rotational point for player
var anchorA = 0.5; // rotational point for player

var upAngle = -40; // how many degrees the player will rotate on click

var upAngleTime = 100; // how many seconds player will stay rotated in ms

var music;

game.create = function () {
  game.time.reset();

  // Game Music
  music = game.add.audio('music');
  music.play();

  // The scrolling starfield
  starfield = this.starfield = game.add.tileSprite( 0, 0, 1024, 768, 'starfield' );

  tree = game.add.group();
  tree.enableBody = true;
  tree.createMultiple(10,'tree');
  tree.setAll('outOfBoundsKill', true);
  tree.setAll('checkWorldBounds', true);

  // init lamp obstacle
  lamp = game.add.group();
  lamp.enableBody = true;
  lamp.createMultiple(10, 'lamp');
  lamp.setAll('outOfBoundsKill', true);
  lamp.setAll('checkWorldBounds', true);

  // init shop2 background
  shop2 = game.add.group();
  shop2.enableBody = true;
  shop2.createMultiple(10,'shop2');
  shop2.setAll('outOfBoundsKill', true);
  shop2.setAll('checkWorldBounds', true);

  // init shop1 background
  shop1 = game.add.group();
  shop1.enableBody = true;
  shop1.createMultiple(10,'shop1');
  shop1.setAll('outOfBoundsKill', true);
  shop1.setAll('checkWorldBounds', true);

  // init cloud1 obstacle
  cloud1 = game.add.group();
  cloud1.enableBody = true;
  cloud1.createMultiple(10,'cloud1');
  cloud1.setAll('outOfBoundsKill', true);
  cloud1.setAll('checkWorldBounds', true);

  // init cloud2 obstacle
  cloud2 = game.add.group();
  cloud2.enableBody = true;
  cloud2.createMultiple(10,'cloud2');
  cloud2.setAll('outOfBoundsKill', true);
  cloud2.setAll('checkWorldBounds', true);

  // init cloud3 obstacle
  cloud3 = game.add.group();
  cloud3.enableBody = true;
  cloud3.createMultiple(10,'cloud3');
  cloud3.setAll('outOfBoundsKill', true);
  cloud3.setAll('checkWorldBounds', true);

  // The player
  player = this.player = this.game.add.sprite( 200, 300, 'ship' );
  var fly = player.animations.add('fly');
  player.animations.play('fly',2,true);
  game.physics.enable( player, Phaser.Physics.ARCADE );
  player.anchor.setTo( anchorA, anchorB );
  player.body.gravity.y = gravityForce;

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftClick = game.input.onDown.add(flap, player);

  // init small sake
  smallSake = game.add.group();
  smallSake.enableBody = true;
  smallSake.createMultiple(1000, 'smallSake');
  smallSake.setAll('outOfBoundsKill', true);
  smallSake.setAll('checkWorldBounds', true);

  // init large sake
  largeSake = game.add.group();
  largeSake.enableBody = true;
  largeSake.createMultiple(1000, 'largeSake');
  largeSake.setAll('outOfBoundsKill', true);
  largeSake.setAll('checkWorldBounds', true);

  // init rock1 obstacle
  rock1 = game.add.group();
  rock1.enableBody = true;
  rock1.createMultiple(10,'rock1');
  rock1.setAll('outOfBoundsKill', true);
  rock1.setAll('checkWorldBounds', true);

  // init rock2 obstacle
  rock2 = game.add.group();
  rock2.enableBody = true;
  rock2.createMultiple(10,'rock2');
  rock2.setAll('outOfBoundsKill', true);
  rock2.setAll('checkWorldBounds', true);

  // Create last score text
  game.add.text(250, 20, 'High Score: ', { font : '30px Arial', fill : 'white' });
  lastScoreText = game.add.text(415, 20, lastScore, { font : '30px Arial', fill : 'white' });

  // Create drunkness label
  game.add.text(20, 20, 'Drunkness: ', { font : '30px Arial', fill : 'white' });
  drunkMeter = game.add.text(180, 20, drunkScore, { font : '30px Arial', fill : 'white' });

  // Create time score
  game.add.text(20, 60, 'Time: ', { font : '30px Arial', fill : 'white' });
  time = game.add.text(110, 60, '0', { font : '30px Arial', fill : 'white' });

  // set timer to decrease drunkness
  this.timer = game.time.events.loop(3000, soberUp, null, this);

  // the scrolling ground
  ground = this.ground = game.add.tileSprite(0, 656, 1024, 115, 'ground');
  ground.physicsType = Phaser.SPRITE;
  game.physics.enable( ground, Phaser.Physics.ARCADE );

  ground2 = this.ground2 = game.add.tileSprite(0, 623, 1024, 150, 'ground2');
  game.physics.enable( ground2, Phaser.Physics.ARCADE );

  // Randomly spawn obstacles
  this.timer = game.time.events.loop(3500, function(){
    cloudArray[game.rnd.integerInRange(0,2)]();
    } , null, this);
  this.timer = game.time.events.loop(5000, function(){
    obstacleArray[game.rnd.integerInRange(0,4)]();
    } , null, this);

  // Randomly generates background items
  this.timer = game.time.events.loop(game.rnd.integerInRange(3000,7000), function(){
    backgroundArray[game.rnd.integerInRange(0,3)]();
    } , null, this);
  this.timer = game.time.events.loop(game.rnd.integerInRange(1000,17000), addTree, null, this);

  // Randomly generates sake
  this.timer = game.time.events.loop(2000, function(){
    sakeArray[game.rnd.integerInRange(0,3)]();
    } , null, this);

}; // ******** end of game create **********

game.update = function () {
  breathalizer(drunkScore);

  if (player.alive === false) {
    restartGame();
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

  game.physics.arcade.collide(player, ground);

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

  // if player is turned up, player will correctly orient down with gravity
  if (player.angle < 90) {
    player.angle += 2.5;
  }

  // flaps with spacebar is pressed or mouse is clicked
  if (fireButton.isDown || game.input.activePointer.isDown ) {
    flap();
  }

    if(player.body.y > 500) {
      player.angle +=0.9;
    }

  // game.physics.arcade.overlap(player,lamp,death,null,this);
  game.physics.arcade.overlap(player,cloud1,death,null,this);
  game.physics.arcade.overlap(player,cloud2,death,null,this);
  game.physics.arcade.overlap(player,cloud3,death,null,this);
  game.physics.arcade.overlap(player,rock1,death,null,this);
  game.physics.arcade.overlap(player,rock2,death,null,this);


  game.physics.arcade.overlap(player,smallSake,collectSake1,null,this);
  game.physics.arcade.overlap(player,largeSake,collectSake3,null,this);

  // time.text = new Time(this);
  time.text = Math.floor(this.game.time.totalElapsedSeconds());
  timeScore = Math.floor(this.game.time.totalElapsedSeconds());

}; // ******** end of game create **********

// allows player to flap upwards
function flap() {
  player.body.velocity.y = flapForce;
  game.add.tween(player).to({ angle : upAngle }, upAngleTime).start();
}

function death() {
  if (player.alive === false) {
    return;
  }
  player.alive = false;
  game.time.events.remove(this.timer);
  lamp.forEachAlive(function(lamp) {
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
  item.body.velocity.x = lampSpeed/2;
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
  item.body.velocity.x = lampSpeed/2;
  item.body.immovable = true;
}

function addShop2() {
  var item = shop2.getFirstExists(false);
  item.reset(1023, 426);
  item.body.velocity.x = lampSpeed/2;
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
  item.reset(1023, game.rnd.integerInRange(0,475));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

function addCloud2() {
  var item = cloud2.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(0,475));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

function addCloud3() {
  var item = cloud3.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(0,500));
  item.body.velocity.x = cloudSpeed;
  item.body.immovable = true;
}

// sake collection functions
function collectSake1(player,sake) {
  sake.kill();
  drink(1);
}

function collectSake3(player,sake) {
  sake.kill();
  drink(3);
}

function drink(amount) {
  if (!(drunkScore > 10) ) {
    drunkScore += amount;
    gravityForce += amount * (100);
    player.body.gravity.y = gravityForce;
    drunkMeter.text = drunkScore;
  }
}

function soberUp() {
  if ( drunkScore === 0 ) {
    drunkScore = 0;
  }
  if ( drunkScore > 0 ){
    drunkScore--;
    gravityForce -= 100;
    player.body.gravity.y = gravityForce;
    drunkMeter.text = drunkScore;
  }
}

function restartGame() {
  finalScore(timeScore,drunkScore);
  isDrunk = false;
  drunkScore = 5;
  game.time.reset();
  game.state.start('game');

}

function finalScore(){
  if((parseInt(lastScore) < (drunkScore*timeScore)) || typeof lastScore !== 'number'){
    lastScore = drunkScore*timeScore;
  }
}

function breathalizer(drunkX){
  if (drunkX >= 10){
    isDrunk = true;
  }
}

function removeMusic () {
  music.destroy();
}

module.exports = game;
