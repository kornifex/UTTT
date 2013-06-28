var Game = function Game (opt) {
  this.id = generateId();
  this.players = [];
  this.io = opt.io;
};

Game.prototype.addPlayer = function addPlayer (player) {
  if (this.players.length <= 2) {
    player.joinRoom(this.id);
    this.players.push(player);
  }
};

Game.prototype.start = function start () {
  this.io.sockets.in(this.id).emit('UT_STARTNAO', {
    id: this.id,
    players: this.players
  });
};

var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Game;