var express = require('express'),
    app     = express(),
    server  = app.listen(40024),
    io      = require('socket.io').listen(server);

// Config
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// Route
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// Sockets
io.sockets.on('connection', function (socket) {
    socket.emit('update', { msg: 'Hello World!' });
});
