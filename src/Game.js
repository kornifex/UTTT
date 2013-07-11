var _ = require('underscore');
var Game = function Game (opt) {
  this.id = generateId();
  this.players = [];
  this.io = opt.io;
  this.playingId = null;
  this.symbols = 0;
  this.move = _.bind(this.move, this);

  console.log('Room ' + this.id + ' created!');
};

Game.prototype.addPlayer = function addPlayer (player) {
  if (this.players.length <= 2) {
    player.joinRoom(this.id, this.symbols++);
    this.players.push(player);
  }
};

Game.prototype.start = function start () {
  this.playingId = this.players[1].id;

  this.players[0].socket.on('UT_MOVE', this.move);
  this.players[1].socket.on('UT_MOVE', this.move);
  this.io.sockets.in(this.id).emit('UT_STARTNAO', {
    id: this.id,
    players: this.players,
    playingId: this.playingId
  });

  console.log('Room ' + this.id + ' start now!');
};

Game.prototype.move = function move (coords) {
  // check move
  var next = this.getNextPlayingId();
  this.io.sockets.in(this.id).emit('UT_MOVENAO', _.extend(coords, {
    playingId: next
  }));
  this.playingId = next;
};

Game.prototype.getNextPlayingId = function move () {
  var playingId = this.playingId;
  var next = _.find(this.players, function(el) {
    return el.id !== playingId;
  });

  return next.id;
};


var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Game;
