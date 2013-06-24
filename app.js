var app = require('express').createServer(),
    io = require('socket.io').listen(app);

server.listen(8080);

// Route
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Sockets
io.sockets.on('connection', function (socket) {
    socket.emit('update', { msg: 'Hello World!' });
});
