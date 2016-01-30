var game = {};
var starfield;
var player;
var cursors;
var fireButton;
var ground;
var leftClick;
var lamp;
var smallSake;
var drunkMeter = 10;

var groundSpeed = 2; // speed of ground movement
var skySpeed = 2; // speed of sky movement

var gravityForce = 1000;
var flapForce = -400; // controls amount of 'power' player flaps

var anchorA = 0.5; // rotational point for player
var anchorB = 0.5; // rotational point for player

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

  // the scrolling ground
  ground = this.ground = game.add.tileSprite(0, 656, 1024, 112, 'ground');
  ground.physicsType = Phaser.SPRITE;
  game.physics.enable( ground, Phaser.Physics.ARCADE );

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftClick = game.input.onDown.add(flap, player);

  // init lamp obstacle
  lamp = game.add.group();
  lamp.enableBody = true;
  lamp.createMultiple(3,'lamp');
  lamp.setAll('outOfBoundsKill', true);
  lamp.setAll('checkWorldBounds', true);

  this.timer = game.time.events.loop(2000, addSmallSake, this);

  // init small sake
  smallSake = game.add.group();
  smallSake.enableBody = true;
  smallSake.physicsType = Phaser.Physics.ARCADE;
  smallSake.createMultiple(5,'smallSake');
  smallSake.setAll('anchor.x', 0.5);
  smallSake.setAll('anchor.y', 0.5);
  smallSake.setAll('outBoundsKill', true);
  smallSake.setAll('checkWorldBounds', true);

  this.timer = game.time.events.loop(2000, addLamp, this);

}; // ******** end of game create **********

game.update = function () {
  if (player.alive === false){
    restartGame();
  }

  game.physics.arcade.collide(player,ground);

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
    if(player.angle < 90) {
      player.angle += 2.5;
    }

    // flaps with spacebar is pressed or mouse is clicked
    if (fireButton.isDown || game.input.activePointer.isDown ) {
      flap();
    }

  game.physics.arcade.overlap(player,lamp,death,null,this);

}; // ******** end of game create **********

// allows player to flap upwards
function flap() {
  player.body.velocity.y = flapForce;
  game.add.tween(player).to({angle: upAngle}, upAngleTime).start();
}

function death() {
  if (player.alive === false){
    return;
  }
  player.alive = false;
  game.time.events.remove(this.timer);
  lamp.forEachAlive(function(lamp){
    lamp.body.velocity.x = 0;
  },this);
  starfield.tilePosition.x = 0;
  ground.tilePosition.x = 0;
}

function addLamp() {
  var item = lamp.getFirstExists(false);
  game.physics.arcade.collide(item,ground);
  item.reset(1023, 367);
  item.body.velocity.x = -200;
  item.body.immovable = true;
}

function addSmallSake() {
  var item = smallSake.getFirstExists(false);
  item.reset(1023, game.rnd.integerInRange(10,500));
  item.body.velocity.x = -200;
  item.body.immovable = true;
}

function collectSake() {
  console.log('collected');
}

function restartGame(){
  game.state.start('game');
}

module.exports = game;
