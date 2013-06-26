define([
  'underscore',
  'backbone'
], function(
  _,
  Backbone
) {

  return Backbone.Router.extend({


    routes: {

      'play/:room': 'play'

    },

    initialize: function(opt) {
      console.info('Router Initializing');
      this.socket = opt.socket;
    },


    play: function(room) {
      console.log('room', room);

      var player = {
        id: 'arthur'
      };

      this.socket.emit('UT_KTHX', {
        id: room,
        playerId: player.id
      });

    }

  });

});