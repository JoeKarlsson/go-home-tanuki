var game = {};
var starfield;
var player;
var greenEnemies;
var cursors;
var bank;
var shipTrail;
var bullets;
var fireButton;
var bulletTimer = 0;

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

game.create = function () {

  // The scrolling starfield

  starfield = this.starfield = game.add.tileSprite( 0, 0, 800, 600, 'starfield' );

  //the bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  // The player
  player = this.player = this.game.add.sprite( 400, 500, 'ship' );
  player.anchor.setTo( 0.5, 0.5 );
  game.physics.enable( player, Phaser.Physics.ARCADE );
  player.body.maxVelocity.setTo( MAXSPEED, MAXSPEED );
  player.body.drag.setTo( DRAG, DRAG );

  //  The baddies!
  greenEnemies = game.add.group();
  greenEnemies.enableBody = true;
  greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
  greenEnemies.createMultiple(5, 'enemy-green');
  greenEnemies.setAll('anchor.x', 0.5);
  greenEnemies.setAll('anchor.y', 0.5);
  greenEnemies.setAll('scale.x', 0.5);
  greenEnemies.setAll('scale.y', 0.5);
  greenEnemies.setAll('angle', 180);
  greenEnemies.setAll('outOfBoundsKill', true);
  greenEnemies.setAll('checkWorldBounds', true);

  launchGreenEnemy();

  //controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // add an emitter for the ship's trail
  shipTrail = game.add.emitter(player.x, player.y + 10, 400 );
  shipTrail.width = 10;
  shipTrail.makeParticles('bullet');
  shipTrail.setXSpeed( 30, -30 );
  shipTrail.setYSpeed( 200, 180 );
  shipTrail.setRotation( 50, -50 );
  shipTrail.setAlpha( 1, 0.01, 800 );
  shipTrail.setScale( 0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
  shipTrail.start( false, 5000, 10 );
};

game.update = function () {
  //  Scroll the background
  starfield.tilePosition.y += 2;

  //  Reset the player, then check for movement keys
  player.body.acceleration.x = 0;

  if (cursors.left.isDown)
  {
    player.body.acceleration.x = -ACCELERATION;
  }  else if (cursors.right.isDown)
  {
    player.body.acceleration.x = ACCELERATION;
  }

  //  Stop at screen edges
  if (player.x > game.width - 50) {
    player.x = game.width - 50;
    player.body.acceleration.x = 0;
  }
  if (player.x < 50) {
    player.x = 50;
    player.body.acceleration.x = 0;
  }

  // Fire bullet
  if (fireButton.isDown || game.input.activePointer.isDown ) {
    fireBullet();
  }

  //  Move ship towards mouse pointer
  if (game.input.x < game.width - 20 &&
      game.input.x > 20 &&
      game.input.y > 20 &&
      game.input.y < game.height - 20) {
    var minDist = 200;
    var dist = game.input.x - player.x;
    player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
  }

  //  Squish and rotate ship for illusion of "banking"
  bank = player.body.velocity.x / MAXSPEED;
  player.scale.x = 1 - Math.abs(bank) / 2;
  player.angle = bank * 30;

  //  Keep the shipTrail lined up with the ship
  shipTrail.x = player.x;
};

function fireBullet() {

  // To avoid bullets from being allowed to fire too fast, set a time limit
  if (game.time.now > bulletTimer) {
    var BULLET_SPEED = 400;
    var BULLET_SPACING = 250;

    // Grab the first available bullet from the pool
    var bullet = bullets.getFirstExists(false);

    if (bullet) {
      // and fire it
      // Make the bullet come out of the tip of the ship with the correct angle
      var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
      bullet.reset( player.x + bulletOffset, player.y);
      bullet.angle = player.angle;
      game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
      bullet.body.velocity.x += player.body.velocity.x;

      bulletTimer = game.time.now + BULLET_SPACING;
    }
  }
}

function launchGreenEnemy() {
  var MIN_ENEMY_SPACING = 300;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 300;

  var enemy = greenEnemies.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.drag.x = 100;
  }

  //  Send another enemy soon
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
}

module.exports = game;
