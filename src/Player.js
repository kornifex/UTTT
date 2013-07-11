var Player = function Player (opt) {
  this.id       = generateId();
  this.socket   = opt.socket;

  console.log('Here comes ' + this.id);
  this.socket.on('UT_KTHX',this.onKthnks);
};

Player.prototype.toJSON = function() {
  return {
    id: this.id,
    symbol: this.symbol
  };
};

Player.prototype.joinRoom = function joinRoom (id, symbol) {
  this.socket.join(id);
  console.log(this.id + ' joined room ' + id);
  this.symbol = symbol;

  this.confirm(id);
};

Player.prototype.confirm = function confirm (roomId) {

  console.log('Confirms for ' + this.id + ' in room ' + roomId);

  this.socket.emit('UT_CONFIRM', {
    roomId: roomId,
    id: this.id,
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
