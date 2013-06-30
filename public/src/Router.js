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
      this.game = opt.game;
    },


    play: function(room) {
      console.log('room', room);

    }

  });

});