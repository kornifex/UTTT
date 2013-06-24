var app = require('express')(),
    server = app.listen(40024),
    io = require('socket.io').listen(server);


// Route
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// Sockets
io.sockets.on('connection', function (socket) {
    socket.emit('update', { msg: 'Hello World!' });
});
