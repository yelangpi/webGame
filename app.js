var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var roomNumber = [];

server.listen(3000, () => {
    console.log("服务器启动了");
});

app.use(require('express').static('public'));

app.get('/', function (req, res) {
    res.redirect('/index.html');
})

io.on('connection', function (socket) {
    socket.on('login', data => {
        console.log(data);
        var num = data.number;
        if (num == null) return;
        var succ = false;
        for (let i = 0; i < roomNumber.length; i++) {
            if (roomNumber[i].number == num) {
                succ = true;
                if (roomNumber[i].count == 1) {
                    roomNumber[i].count++;
                    socket.number = num;
                    socket.count = 2;
                    for (const key in io.sockets.sockets) {
                        if ((io.sockets.sockets[key].number == data.number) && (io.sockets.sockets[key].count == 1)) {
                            socket.to(key).emit('connectFriend', { number: data.number });
                            break;
                        }
                    }

                }
                else {
                    console.log("房间人已经满了");
                    socket.emit("loginError", { state: 0 });
                    return;
                }
            }

        }
        if (!succ) {
            roomNumber.push({ number: data.number, count: 1 });
            socket.number = num;
            socket.count = 1;
        }
        if (succ) {
            console.log("加入房间" + data.number);
            socket.emit("loginSuccess", { state: 0, number: data.number });
        }
        else {
            console.log("创建房间" + data.number);
            socket.emit("loginSuccess", { state: 1, number: data.number });
        }
    });
    socket.on('disconnect', () => {
        if (!socket.number) return;
        for (const key in io.sockets.sockets) {
            if ((io.sockets.sockets[key].number == socket.number) && (io.sockets.sockets[key].count != socket.count)) {
                socket.to(key).emit('disconnectFriend', { number: socket.number });
                delete io.sockets.sockets[key].count;
                delete io.sockets.sockets[key].number;
                break;
            }
        }
        for (let i = 0; i < roomNumber.length; i++) {
            var rn = roomNumber[i];
            if (rn.number == socket.number) {
                roomNumber.splice(i, 1);
                break;
            }
        }
    });
    socket.on('clickPoint', data => {
        if (!socket.number) return;
        for (const key in io.sockets.sockets) {
            if ((io.sockets.sockets[key].number == socket.number) && (io.sockets.sockets[key].count != socket.count)) {
                var x = data.x;
                var y = 9 - data.y;
                socket.to(key).emit('ClickPoint', { x: x, y: y });
                break;
            }
        }
    });
    socket.on('clickMan', data => {
        if (!socket.number) return;
        for (const key in io.sockets.sockets) {
            if ((io.sockets.sockets[key].number == socket.number) && (io.sockets.sockets[key].count != socket.count)) {
                var x = data.x;
                var y = 9 - data.y;
                var keyFirst = data.key.slice(0, 1);
                if (/[A-Z]/.test(keyFirst)) {
                    keyFirst = keyFirst.toLowerCase();
                }
                else {
                    keyFirst = keyFirst.toUpperCase();
                }
                var key2 = keyFirst + data.key.slice(1, 2);
                socket.to(key).emit('ClickMan', { x: x, y: y, key: key2 });
                break;
            }
        }
    });
})