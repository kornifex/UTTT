require.config({
  paths   : {
    underscore    : 'lib/underscore',
    backbone      : 'lib/backbone',
    jquery        : 'lib/jquery',
    socket        : 'http://' + document.location.host + '/socket.io/socket.io'
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

  var socket = io.connect('http://' + document.location.host);



  window.app = new MainController({
    socket: socket
  });

});
