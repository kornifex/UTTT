require.config({
  paths   : {
    underscore    : 'lib/underscore',
    jquery        : 'lib/jquery',
    socket        : 'http://localhost:40024/socket.io/socket.io'
  },
  shim    : {
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
  socket.on('update', function (update) {
    console.log(update.msg);
  });

  window.app = new MainController();

});
