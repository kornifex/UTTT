var Player = function Player (opt) {
  this.id       = generateId();
  this.socket   = opt.socket;
};

Player.prototype.toJSON = function() {
  return {
    id: this.id
  };
};

Player.prototype.joinRoom = function joinRoom (id) {
  this.socket.join(id);
  console.log('joined room ' + id);

  this.confirm(id);
};

Player.prototype.confirm = function confirm (roomId) {
  this.socket.emit('UT_CONFIRM', {
    roomId: roomId,
    id: this.id
  });
};

var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Player;
