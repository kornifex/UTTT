var j = 0;

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
    message: 'OK merci michel'
  });
};

var generateId = function () {
  return j++;
};

module.exports = Player;