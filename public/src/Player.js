define([
  'underscore',
  'src/BaseClass'
], function(
  _,
  BaseObject
) {

  var Player = BaseObject.extend({

    initialize: function(opt) {
      opt           = opt || {};
      this.id       = opt.id || null;
      this.game     = opt.game;
      this.socket   = opt.socket;

      this.socket.on('UT_CONFIRM' , _.bind( this.onConfirm  , this ));
      this.socket.emit('UT_GAMEPLZ');

      BaseObject.prototype.initialize.call(this);
    },

    setId: function(id) {
      this.id = id;
    },

    playing: function() {
      console.log('PLAYER CAN NOW PLAY');
      this.active = true;
    },

    idle: function() {
      console.log('PLAYER NOW WAITING');
      this.active = false;
    },

    onConfirm: function(data) {
      this.setId(data.id);
      this.symbol = data.symbol;
      console.log('CONFIRM', data);
      this.socket.emit('UT_KTHX', {
        gameId: data.gameId
      });
    }

  });

  return Player;

});