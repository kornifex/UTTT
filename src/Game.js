var Game = function Game (opt) {
  this.id = generateId();
  this.players = [];
  this.io = opt.io;
  this.playingId = null;

    s.on('UT_MOVE', this.onMove);
};

Game.prototype.addPlayer = function addPlayer (player) {
  if (this.players.length <= 2) {
    player.joinRoom(this.id);
    this.players.push(player);
  }
};

Game.prototype.start = function start () {
  this.playingId = this.players[0].id;

  this.io.sockets.in(this.id).emit('UT_STARTNAO', {
    id: this.id,
    players: this.players,
    playingId: this.playingId
  });
};

Game.prototype.onMove = function onMove () {

};

Game.prototype.move = function move () {
  // check move

  this.io.sockets.in(this.id).emit('UT_MOVENAO', {
    playingId: this.playingId
  });
};

var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Game;
