var express = require('express'),
    app     = express(),
    server  = app.listen(40024),
    io      = require('socket.io').listen(server),
    Player  = require('./src/Player'),
    Game    = require('./src/Game');

var games = [];

// Config
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// Route
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// Sockets
io.sockets.on('connection', function (s) {

  var player = new Player({
    socket: s
  });

  s.on('UT_GAMEPLZ', function () {

    var game;

    for (var k in games) {
      if (games[k].players && games[k].players.length < 2) {
        game = games[k];
      }
    }

    if (!game) {
      game = new Game({
        io: io
      });
      game.addPlayer(player);
      games.push(game);

      player.wait();

    } else {

      game.addPlayer(player);
      game.start();

    }

  });
});

