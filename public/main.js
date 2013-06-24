var socket = io.connect('http://localhost:40024');
socket.on('update', function (update) {
    console.log(update.msg);
});