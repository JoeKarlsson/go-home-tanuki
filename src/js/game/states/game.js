var game = {};
var starfield;
var player;

var cursors;
var fireButton;
var ground;
var leftClick;

var lamp;
var leaf;
var rock;
var randomObstacleIndex;
var obstacleArray = [addLamp,addLeaf,addRock];

// init
var drunkScore = 10;

var smallSake;
var largeSake;

var lampSpeed = -200;
var groundSpeed = 2; // speed of ground movement
var skySpeed = 1.5; // speed of sky movement

var gravityForce = 1000; // sets gravity
var flapForce = -400; // controls amount of 'power' player flaps

var anchorB = 0.5; // rotational point for player
var anchorA = 0.5; // rotational point for player

var upAngle = -40; // how many degrees the player will rotate on click

var upAngleTime = 100; // how many seconds player will stay rotated in ms

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

game.create = function () {

  // The scrolling starfield
  starfield = this.starfield = game.add.tileSprite( 0, 0, 1024, 768, 'starfield' );

  // The player
  player = this.player = this.game.add.sprite( 200, 300, 'ship' );
  game.physics.enable( player, Phaser.Physics.ARCADE );
  player.anchor.setTo( anchorA, anchorB );
  player.body.gravity.y = gravityForce;

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftClick = game.input.onDown.add(flap, player);

  // init lamp obstacle
  lamp = game.add.group();
  lamp.enableBody = true;
  lamp.createMultiple(10, 'lamp');
  lamp.setAll('outOfBoundsKill', true);
  lamp.setAll('checkWorldBounds', true);

  // init leaf obstacle
  leaf = game.add.group();
  leaf.enableBody = true;
  leaf.createMultiple(10, 'leaf');
  leaf.setAll('outOfBoundsKill', true);
  leaf.setAll('checkWorldBounds', true);

  // init rock obstacle
  rock = game.add.group();
  rock.enableBody = true;
  rock.createMultiple(10, 'rock');
  rock.setAll('outOfBoundsKill', true);
  rock.setAll('checkWorldBounds', true);

  // the scrolling ground
  ground = this.ground = game.add.tileSprite(0, 656, 1024, 112, 'ground');
  ground.physicsType = Phaser.SPRITE;
  game.physics.enable( ground, Phaser.Physics.ARCADE );

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

  // Randomally spawn obstacles
  this.timer = game.time.events.loop(game.rnd.integerInRange(7000, 10000), addLargeSake, null, this);
  this.timer = game.time.events.loop(game.rnd.integerInRange(3000, 7000), addSmallSake, null, this);
  this.timer = game.time.events.loop(game.rnd.integerInRange(1000, 2000), function() {
    obstacleArray[game.rnd.integerInRange(0, 2)]();
  }, null, this);

  // Create drunkness label
  game.add.text(20, 20, 'Drunkness: ', { font : '30px Arial', fill : 'white' });
  drunkMeter = game.add.text(180, 20, drunkScore, { font : '30px Arial', fill : 'white' });

  // Create time score
  game.add.text(20, 60, 'Time: ', { font : '30px Arial', fill : 'white' });
  time = game.add.text(110, 60, '0', { font : '30px Arial', fill : 'white' });

  // set timer to decrease drunkness
  this.timer = game.time.events.loop(3000, soberUp, null, this);

}; // ******** end of game create **********

game.update = function () {
  if (player.alive === false) {
    restartGame();
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

  // player interactions with world objects
  game.physics.arcade.overlap(player, lamp, death, null, this);
  game.physics.arcade.overlap(player, smallSake, collectSake1, null, this);
  game.physics.arcade.overlap(player, largeSake, collectSake3, null, this);

  time.text = Math.floor(this.game.time.totalElapsedSeconds());

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
  drunkScore = 10;
  gravityForce = 1000; // sets gravity
}

// adds objects into the world
function addLamp() {
  var item = lamp.getFirstExists(false);
  item.reset(1023, 367);
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

function addLeaf() {
  var item = leaf.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(25, 300));
  item.body.velocity.x = lampSpeed;
  item.body.immovable = true;
}

function addRock() {
  var item = rock.getFirstExists(false);
  item.reset(1023, 467);
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
  if ( drunkScore <= 0 ) {
    return death();
  }
  drunkScore--;
  gravityForce -= 100;
  player.body.gravity.y = gravityForce;
  drunkMeter.text = drunkScore;
}

function restartGame() {
  game.state.start('game');
}

module.exports = game;
