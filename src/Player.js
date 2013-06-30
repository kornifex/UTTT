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
};

Player.prototype.wait = function wait () {
  this.socket.emit('UT_WAITNAO', {
    id: this.id,
    message: 'OK merci michel'
  });
};

var generateId = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = Player;
