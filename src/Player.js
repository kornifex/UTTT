var moniker = require('moniker');

var Player = function Player (opt) {
  this.id       = generateId();
  this.socket   = opt.socket;
  this.name     = moniker.choose();

  console.log('Here comes ' + this.name + ' (' + this.id + ')');
  this.socket.on('UT_KTHX',this.onKthnks);
};

Player.prototype.toJSON = function() {
  return {
    id: this.id,
    symbol: this.symbol,
    name: this.name
  };
};

Player.prototype.joinRoom = function joinRoom (id, symbol) {
  this.socket.join(id);
  console.log(this.name + ' (' + this.id + ') ' + ' joined room ' + id);
  this.symbol = symbol;

  this.confirm(id);
};

Player.prototype.confirm = function confirm (roomId) {

  console.log('Confirms for ' + this.name + ' (' + this.id + ') ' + ' in room ' + roomId);

  this.socket.emit('UT_CONFIRM', {
    roomId: roomId,
    id: this.id,
    name: this.name,
    symbol: this.symbol || 0
  });
};

Player.prototype.onKthnks = function onKthnks (gameId) {
  // ok ok
};

var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Player;
