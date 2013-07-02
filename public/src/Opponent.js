define([
  'underscore',
  'src/Player'
], function(
  _,
  Player
) {

  return Player.extend({

    initialize: function() {

    },
    playing: function() {
      this.active = true;
    },
    idle: function() {
      this.active = false;
    }

  });

});