var game = {};
var starfield;
var player;
var cursors;
var fireButton;
var ground;
var leftClick;

var groundSpeed = 2; // speed of ground movement
var skySpeed = 2; // speed of sky movement

var gravityForce = 1000;
var flapForce = -400; // controls amount of 'power' player flaps

var anchorA = 0.5; // rotational point for player
var anchorB = 0.5; // rotational point for player

var upAngle = -40; // how many degrees the player will rotate on click
var upAngleTime = 1000; // how many seconds player will stay rotated in ms

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

game.create = function () {
  // environment gravity
  game.physics.arcade.gravity.y = gravityForce;

  // The scrolling starfield
  starfield = this.starfield = game.add.tileSprite( 0, 0, 1024, 768, 'starfield' );

  // The player
  player = this.player = this.game.add.sprite( 200, 300, 'ship' );
  game.physics.enable( player, Phaser.Physics.ARCADE );
  player.anchor.setTo( anchorA, anchorB );

  // the scrolling ground
  // note on collission not being detected on phaser 2.3 for sprites
  // http://www.html5gamedevs.com/topic/13856-problem-with-collide-method-from-physics-arcade-in-different-versions-of-phaser/
  ground = this.ground = game.add.tileSprite(0, 656, 1024, 112, 'ground');
  ground.physicsType = Phaser.SPRITE;
  game.physics.enable( ground, Phaser.Physics.ARCADE );

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftClick = game.input.onDown.add(flap, player);

}; // ******** end of game create **********

game.update = function () {
  game.physics.arcade.collide(player,ground);

  // scroll the ground
  ground.tilePosition.x -= groundSpeed;
  game.physics.arcade.enableBody(ground);
  ground.body.allowGravity = false;
  ground.body.checkCollision = true;
  // ground.body.collideWorldBounds = true;
  ground.body.allowGravity = false;
  ground.body.immovable = true;
  ground.body.moves = false;
  // ground.body.enable = false;

  // Scroll the background
  starfield.tilePosition.x -= skySpeed;

  // player can collide with upper and lower bounds
  player.body.collideWorldBounds = true;
  // game.physics.arcade.collide(player, ground, deathHandler(),game);

    // if player is turned up, player will correctly orient down with gravity
    if(player.angle < 90) {
      player.angle += 2.5;
    }

    // flaps with spacebar is pressed or mouse is clicked
    if (fireButton.isDown || game.input.activePointer.isDown ) {
      flap();
    }


}; // ******** end of game create **********

// allows player to flap upwards
function flap() {
  player.body.velocity.y = flapForce;
  game.add.tween(player).to({angle: upAngle}, upAngleTime).start();
}

function deathHandler() {
  console.log('game over');
  // game.state.start('gameover');
}

// function launchGreenEnemy() {
//   var MIN_ENEMY_SPACING = 300;
//   var MAX_ENEMY_SPACING = 3000;
//   var ENEMY_SPEED = 300;

//   var enemy = greenEnemies.getFirstExists(false);
//   if (enemy) {
//     enemy.reset(game.rnd.integerInRange(0, game.width), -20);
//     enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
//     enemy.body.velocity.y = ENEMY_SPEED;
//     enemy.body.drag.x = 100;
//   }

//   //  Send another enemy soon
//   game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
// }

module.exports = game;
