var load = function  () {};
var plaque;
var checkmark;
var checkmark2;
var underline;


load.prototype.preload = function() {

};
load.prototype.create = function() {
  plaque = this.add.image(200,50,'plaque');
};

load.prototype.update = function() {
  this.time.events.add( Phaser.Timer.SECOND * 0.5, this.checkmarkFunc, this );
  this.time.events.add( Phaser.Timer.SECOND * 1, this.checkmarkFunc2, this );
  this.time.events.add( Phaser.Timer.SECOND * 1.5, this.underlineFunc, this );
  this.time.events.add( Phaser.Timer.SECOND * 2.5, this.loadSplash, this );

  // var timer = load.time.now;
  // if(this.time.now >= timer+1) {
  // }
};

module.exports = load;

// helper functions
//
load.prototype.checkmarkFunc = function () {
  checkmark = this.add.image(350,260,'checkmark');
};

load.prototype.checkmarkFunc2 = function () {
  checkmark2 = this.add.image(350,360,'checkmark');
};

load.prototype.underlineFunc = function () {
  underline = this.add.image(350,525,'underline');
};

load.prototype.loadSplash = function () {
  var self = this;
  self.game.state.start('splash');
}