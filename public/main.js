require.config({
  paths   : {
    underscore    : 'lib/underscore',
    backbone      : 'lib/backbone',
    jquery        : 'lib/jquery',
    socket        : 'http://localhost:40024/socket.io/socket.io'
  },
  shim    : {
    backbone    : {
      deps        : [ 'jquery', 'underscore' ],
      exports     : 'Backbone'
    },
    underscore  : {
      exports     : '_'
    }
  }
});

require([
  'socket',
  'jquery',
  'underscore',
  'src/MainController'
], function(
  io,
  $,
  _,
  MainController
) {

  var socket = io.connect('http://localhost:40024');



  window.app = new MainController({
    socket: socket
  });

});
