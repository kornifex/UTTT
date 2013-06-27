define([
  'underscore',
  'src/BaseClass',
  'src/Arena'
], function(
  _,
  BaseObject,
  Arena
) {

  return BaseObject.extend({

    players: [],

    initialize: function(opt) {
      console.info('Game Created !');

      this.client     = opt.client || false;
      this.controller = opt.controller;
      this.socket     = opt.socket;

      if(this.client) {

        this.socket.on('UT_JOINPLZ' , _.bind( this.onJoinPlz  , this ));
        this.socket.on('UT_STARTNAO', _.bind( this.onStartNao , this ));
        this.socket.on('UT_WAITNAO' , _.bind( this.onWaitNao  , this ));

        this.socket.emit('UT_GAMEPLZ');

      }

      this.arena = new Arena();
      this.arena.render();
      this.arena.draw();
    },

    onJoinPlz: function(data) {

      this.controller.router.navigate('play/' + data.id, {
        trigger: true,
        replace: false
      });

    },

    onStartNao: function(data) {
      console.log('STARTNAO', data);

      // this.players[1] = new Player(data.playerId);

    },

    onWaitNao: function(data) {
      console.log('WAITNAO', data);
    }

  });
});