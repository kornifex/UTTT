define([
  'underscore',
  'src/BaseClass',
  'src/Router',
  'src/Game'
], function(
  _,
  BaseClass,
  Router,
  Game
) {

  return BaseClass.extend({

    initialize: function(opt) {
      console.info('mainController initialized');

      this.router = new Router({
        socket: opt.socket
      });
      this.game = new Game({
        client: true,
        controller: this,
        socket: opt.socket
      });


      // Go !
      Backbone.history.start();

    }

  });

});