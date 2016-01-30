var game = {};
var starfield;
var player;
var tanuki;
var pipes;

game.create = function () {

  // The scrolling starfield

  starfield = this.starfield = game.add.tileSprite( 0, 0, 800, 600, 'starfield' );

  // Set the physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Display the tanuki on the screen
  tanuki = this.tanuki = this.game.add.sprite(100, 245, 'tanuki');


  //Add anchor to tanuki to animate correctly
  tanuki.anchor.setTo(-0.2, 0.5);

  // Add gravity to the tanuki to make it fall
  game.physics.arcade.enable(tanuki);
  tanuki.body.gravity.y = 1000;

  // Call the 'jump' function when the spacekey is hit
  var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  // spaceKey.onDown.add(this.jump, this);
  // pipes = this.pipes = game.add.group(); // Create a group

  // //Create the pipes
  // pipes.enableBody = true;  // Add physics to the group
  // pipes.createMultiple(20, 'pipe'); // Create 20 pipes
  // this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

  // // Create the score label
  // this.score = 0;
  // this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

};

game.update = function () {
  //  Scroll the background
  starfield.tilePosition.x -= 2;

  //always angle the bird downwards
  if (tanuki.angle < 20) {
      tanuki.angle += 1;
  }

  // If the bird is out of the world (too high or too low), call the 'restartGame' function
  // if (this.bird.inWorld == false)
      // this.restartGame();
};

// Restart the game
function restartGame() {
// Start the 'main' state, which restarts the game
  game.state.start('main');
}

// Make the tanuki jump
function jump() {

    //make the bird jump when it's dead.
    if (this.bird.alive == false)
        return;

    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;

    // Create an animation on the bird
    var animation = game.add.tween(this.bird);

    // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
    animation.to({angle: -20}, 100);

    // And start the animation
    animation.start();
}

module.exports = game;
