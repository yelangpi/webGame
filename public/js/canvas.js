var Graph = {};
var ChessGame = {};
Graph.init = function () {
    Graph.width = Graph.style.width;
    Graph.height = Graph.style.height;
    Graph.spaceX = Graph.style.spaceX;
    Graph.spaceY = Graph.style.spaceY;
    Graph.pointStartX = Graph.style.pointStartX;
    Graph.pointStartY = Graph.style.pointStartY;
    Graph.page = Graph.style.page;
    Graph.canvas = document.getElementById("chess");
    Graph.pen = Graph.canvas.getContext("2d");
    Graph.canvas.width = Graph.width;
    Graph.canvas.height = Graph.height;
    Graph.chessList2 = [];
    Graph.LoadImage();
}
Graph.style = {
    width: 523,
    height: 580,
    spaceX: 57,
    spaceY: 57,
    pointStartX: 3,
    pointStartY: 5,
    page: "style",
}
Graph.initMap = [
    ['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1'],
    [, , , , , , , ,],
    [, 'P0', , , , , , 'P1',],
    ['Z0', , 'Z1', , 'Z2', , 'Z3', , 'Z4'],
    [, , , , , , , ,],
    [, , , , , , , ,],
    ['z0', , 'z1', , 'z2', , 'z3', , 'z4'],
    [, 'p0', , , , , , 'p1',],
    [, , , , , , , ,],
    ['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1']
]

Graph.chessmanKey = {
    //红子
    'c': { text: "车", img: 'r_c', isMe: true, key: "c" },
    'm': { text: "马", img: 'r_m', isMe: true, key: "m" },
    'x': { text: "相", img: 'r_x', isMe: true, key: "x" },
    's': { text: "仕", img: 'r_s', isMe: true, key: "s" },
    'j': { text: "将", img: 'r_j', isMe: true, key: "j" },
    'p': { text: "炮", img: 'r_p', isMe: true, key: "p" },
    'z': { text: "兵", img: 'r_z', isMe: true, key: "z" },

    //黑子
    'C': { text: "车", img: 'h_c', isMe: false, key: "c" },
    'M': { text: "马", img: 'h_m', isMe: false, key: "m" },
    'X': { text: "相", img: 'h_x', isMe: false, key: "x" },
    'S': { text: "仕", img: 'h_s', isMe: false, key: "s" },
    'J': { text: "将", img: 'h_j', isMe: false, key: "j" },
    'P': { text: "炮", img: 'h_p', isMe: false, key: "p" },
    'Z': { text: "兵", img: 'h_z', isMe: false, key: "z" }
}
Graph.image = {};

//背景
Graph.image.Bg = function () {
    this.isShow = true;
    this.show = function () {
        if (this.isShow) {
            Graph.pen.drawImage(Graph.bgImg, 0, 0);
        }
    }
}

//边框
Graph.image.Pane = function () {
    this.x = 0;
    this.y = 0;
    this.new_x = 0;
    this.new_y = 0;
    this.isShow = true;

    this.show = function () {
        if (this.isShow) {
            Graph.pen.drawImage(Graph.paneImg, Graph.spaceX * this.x + Graph.pointStartX, Graph.spaceY * this.y + Graph.pointStartY);
            Graph.pen.drawImage(Graph.paneImg, Graph.spaceX * this.new_x + Graph.pointStartX, Graph.spaceY * this.new_y + Graph.pointStartY);
        }
    }
}
//提示点
Graph.image.Dot = function () {
    this.isShow = true;
    this.dots = []
    this.show = function () {
        for (var i = 0; i < this.dots.length; i++) {
            if (this.isShow) Graph.pen.drawImage(Graph.dotImg, Graph.spaceX * this.dots[i][0] + 10 + Graph.pointStartX, Graph.spaceY * this.dots[i][1] + 10 + Graph.pointStartY)
        }
    }
}
//棋子
Graph.chessmanList = [];
Graph.image.Chessman = function (name, x, y) {
    this.name = name;
    this.nameFirst = name.slice(0, 1);
    this.isMe = Graph.chessmanKey[this.nameFirst].isMe;
    this.x = x || 0;
    this.y = y || 0;
    this.isShow = true;

    this.show = function () {
        if (this.isShow) {
            Graph.pen.drawImage(Graph.chessman[this.nameFirst], Graph.spaceX * this.x + Graph.pointStartX, Graph.spaceY * this.y + Graph.pointStartY);
        }
    }
}
Graph.showPane = function (x, y, new_x, new_y) {
    Graph.pane.x = x;
    Graph.pane.y = y;
    Graph.pane.new_x = new_x;
    Graph.pane.new_y = new_y;
    Graph.pane.isShow = true;
}

Graph.LoadImage = function () {
    Graph.bg = new Graph.image.Bg();
    Graph.bgImg = new Image();
    Graph.bgImg.src = "img/" + Graph.page + "/bg.png";

    Graph.pane = new Graph.image.Pane();
    Graph.paneImg = new Image();
    Graph.paneImg.src = "img/" + Graph.page + "/r_box.png";
    Graph.pane.isShow = false;

    Graph.dot = new Graph.image.Dot();
    Graph.dotImg = new Image();
    Graph.dotImg.src = "img/" + Graph.page + "/dot.png";

    Graph.chessman = [];
    for (i in Graph.chessmanKey) {
        Graph.chessman[i] = new Image();
        Graph.chessman[i].src = "img/" + Graph.page + "/" + Graph.chessmanKey[i].img + ".png";
    }
}

Graph.show = function () {
    Graph.pen.clearRect(0, 0, Graph.width, Graph.height);
    Graph.bg.show();
    Graph.pane.show();
    Graph.dot.show();
    for (let i = 0; i < Graph.chessmanList.length; i++) {
        Graph.chessmanList[i].show();
    }
}

ChessGame.init = function () {
    ChessGame.isMe = true;
    ChessGame.nowChess = false;
    ChessGame.createMap();
    Graph.canvas.addEventListener("click", ChessGame.clickCanvas);
}
ChessGame.createMap = function () {
    for (let i = 0; i < Graph.initMap.length; i++) {
        for (let j = 0; j < Graph.initMap[i].length; j++) {
            var name = Graph.initMap[i][j];
            if (name) {
                var man = new Graph.image.Chessman(name, j, i);
                Graph.chessmanList.push(man);
                Graph.chessList2[name] = man;
                Graph.chessList2[name].x = j;
                Graph.chessList2[name].y = i;
            }
        }
    }
}
ChessGame.clearMap = function () {
    Graph.chessmanList = [];
}
ChessGame.getClickMan = function (e) {
    var point = ChessGame.getClickPoint(e);
    var x = point.x;
    var y = point.y;
    if (x < 0 || x > 8 || y < 0 || y > 9) return false;
    if (Graph.initMap[y][x]) return Graph.initMap[y][x];
    return false;
}
ChessGame.getClickPoint = function (e) {
    var canvasPosX = Graph.canvas.offsetLeft;
    var canvasPosY = Graph.canvas.offsetTop;
    var c = Graph.canvas.offsetParent;
    while (c != null) {
        canvasPosX += c.offsetLeft;
        canvasPosY += c.offsetTop;
        c = c.offsetParent;
    }
    var x = Math.round((e.pageX - canvasPosX - 20) / Graph.spaceX);
    var y = Math.round((e.pageY - canvasPosY - 20) / Graph.spaceY);
    var value = { "x": x, "y": y };
    return value;
}
ChessGame.clickPoint = function (x, y) {
    if (ChessGame.nowChess) {
        if (ChessGame.inDots(x, y)) {
            var now = Graph.chessList2[ChessGame.nowChess];
            delete Graph.initMap[now.y][now.x];
            Graph.showPane(now.x, now.y, x, y);
            now.x = x;
            now.y = y;
            Graph.initMap[now.y][now.x] = ChessGame.nowChess;
            Graph.pane.isShow = true;
            Graph.dot.dots = [];
            Graph.show();
            ChessGame.nowChess = false;
            // turn
            if (ChessGame.isMe) {
                ChessGame.socket.emit("clickPoint", { x: x, y: y });
            }
            ChessGame.isMe = !ChessGame.isMe;
            
        }
    }
    if (ChessGame.isMe) {
        document.getElementById("messegeBox").innerHTML = "轮到你了......";
    }
    else {
        document.getElementById("messegeBox").innerHTML = "等待对手......";
    }
}
ChessGame.clickMan = function (key, x, y) {
    if (ChessGame.isMe) {
        ChessGame.socket.emit("clickMan", { x: x, y: y, key: key });
    }
    var keyFirst = key.slice(0, 1);
    if (Graph.chessmanKey[keyFirst].isMe == ChessGame.isMe) {
        ChessGame.nowChess = key;
        Graph.dot.dots = Graph.Law[Graph.chessmanKey[keyFirst].key](x, y, Graph.initMap, Graph.chessmanKey[keyFirst].isMe);
        Graph.showPane(x, y, x, y);
        Graph.show();
    }
    else {
        if (ChessGame.nowChess) {
            if (ChessGame.inDots(x, y)) {
                var now = Graph.chessList2[ChessGame.nowChess];
                var now2 = Graph.chessList2[key];
                now2.isShow = false;
                delete Graph.initMap[now.y][now.x];
                Graph.showPane(now.x, now.y, x, y);
                now.x = x;
                now.y = y;
                Graph.initMap[now.y][now.x] = ChessGame.nowChess;
                Graph.pane.isShow = true;
                Graph.dot.dots = [];
                Graph.show();
                ChessGame.nowChess = false;
                // turn
                ChessGame.isMe = !ChessGame.isMe;
            }
        }
    }
    if (ChessGame.isMe) {
        document.getElementById("messegeBox").innerHTML = "轮到你了......";
    }
    else {
        document.getElementById("messegeBox").innerHTML = "等待对手......";
    }
}
ChessGame.clickCanvas = function (e) {
    if (!ChessGame.isMe) return false;

    var key = ChessGame.getClickMan(e);
    var point = ChessGame.getClickPoint(e);
    if (key) {
        ChessGame.clickMan(key, point.x, point.y);
    }
    else {
        ChessGame.clickPoint(point.x, point.y);
    }
}
ChessGame.inDots = function (x, y) {
    for (let i = 0; i < Graph.dot.dots.length; i++) {
        const element = Graph.dot.dots[i];
        if ((element[0] == x) && (element[1] == y)) {
            return true;
        }
    }
    return false;
}
window.onload = function () {
    document.getElementsByTagName("body")[0].style.background = "url(img/" + Graph.page + "/bg.jpg)";
    var socket = io('http://localhost:3000');
    ChessGame.socket = socket;
    var roomNumber = prompt("请输入房间号");
    var r = /^\+?[1-9][0-9]*$/;
    while (!r.test(roomNumber)) {
        roomNumber = prompt("请重新输入：");
    }
    socket.emit("login", { number: Number(roomNumber) });
    socket.on("loginSuccess", function (data) {
        if (data.state == 0) {
            document.getElementById("messegeBox").innerHTML = "加入房间成功" + data.number;
            Graph.chessmanKey = {
                //黑子
                'c': { text: "车", img: 'h_c', isMe: true, key: "c" },
                'm': { text: "马", img: 'h_m', isMe: true, key: "m" },
                'x': { text: "相", img: 'h_x', isMe: true, key: "x" },
                's': { text: "仕", img: 'h_s', isMe: true, key: "s" },
                'j': { text: "将", img: 'h_j', isMe: true, key: "j" },
                'p': { text: "炮", img: 'h_p', isMe: true, key: "p" },
                'z': { text: "兵", img: 'h_z', isMe: true, key: "z" },

                //红子
                'C': { text: "车", img: 'r_c', isMe: false, key: "c" },
                'M': { text: "马", img: 'r_m', isMe: false, key: "m" },
                'X': { text: "相", img: 'r_x', isMe: false, key: "x" },
                'S': { text: "仕", img: 'r_s', isMe: false, key: "s" },
                'J': { text: "将", img: 'r_j', isMe: false, key: "j" },
                'P': { text: "炮", img: 'r_p', isMe: false, key: "p" },
                'Z': { text: "兵", img: 'r_z', isMe: false, key: "z" }
            }
            Graph.LoadImage();
            ChessGame.isMe = false;
            Graph.show();
        }
        else {
            document.getElementById("messegeBox").innerHTML = "创建房间成功" + data.number;
            Graph.show();
        }
    });
    socket.on("loginError", function (data) {
        roomNumber = prompt("房间人已满，请重新输入：");
        var r = /^\+?[1-9][0-9]*$/;
        while (!r.test(roomNumber)) {
            roomNumber = prompt("请重新输入：");
        }
        socket.emit("login", { number: Number(roomNumber) });
    });
    socket.on("disconnectFriend", function (data) {
        alert("对方退出房间,游戏结束");
    });
    socket.on("ClickPoint", function (data) {
        console.log(data);
        ChessGame.clickPoint(data.x, data.y);
    });
    socket.on("ClickMan", function (data) {
        console.log(data);
        ChessGame.clickMan(data.key,data.x, data.y);
    });
}
Graph.Law = {};
Graph.Law.m = function (x, y, initMap, isMe) {
    var lawDot = [];
    //1点
    if (y - 2 >= 0 && x + 1 <= 8 && !initMap[y - 1][x] && (!Graph.chessList2[initMap[y - 2][x + 1]] || Graph.chessList2[initMap[y - 2][x + 1]].isMe != isMe)) lawDot.push([x + 1, y - 2]);
    //2点
    if (y - 1 >= 0 && x + 2 <= 8 && !initMap[y][x + 1] && (!Graph.chessList2[initMap[y - 1][x + 2]] || Graph.chessList2[initMap[y - 1][x + 2]].isMe != isMe)) lawDot.push([x + 2, y - 1]);
    //4点
    if (y + 1 <= 9 && x + 2 <= 8 && !initMap[y][x + 1] && (!Graph.chessList2[initMap[y + 1][x + 2]] || Graph.chessList2[initMap[y + 1][x + 2]].isMe != isMe)) lawDot.push([x + 2, y + 1]);
    //5点
    if (y + 2 <= 9 && x + 1 <= 8 && !initMap[y + 1][x] && (!Graph.chessList2[initMap[y + 2][x + 1]] || Graph.chessList2[initMap[y + 2][x + 1]].isMe != isMe)) lawDot.push([x + 1, y + 2]);
    //7点
    if (y + 2 <= 9 && x - 1 >= 0 && !initMap[y + 1][x] && (!Graph.chessList2[initMap[y + 2][x - 1]] || Graph.chessList2[initMap[y + 2][x - 1]].isMe != isMe)) lawDot.push([x - 1, y + 2]);
    //8点
    if (y + 1 <= 9 && x - 2 >= 0 && !initMap[y][x - 1] && (!Graph.chessList2[initMap[y + 1][x - 2]] || Graph.chessList2[initMap[y + 1][x - 2]].isMe != isMe)) lawDot.push([x - 2, y + 1]);
    //10点
    if (y - 1 >= 0 && x - 2 >= 0 && !initMap[y][x - 1] && (!Graph.chessList2[initMap[y - 1][x - 2]] || Graph.chessList2[initMap[y - 1][x - 2]].isMe != isMe)) lawDot.push([x - 2, y - 1]);
    //11点
    if (y - 2 >= 0 && x - 1 >= 0 && !initMap[y - 1][x] && (!Graph.chessList2[initMap[y - 2][x - 1]] || Graph.chessList2[initMap[y - 2][x - 1]].isMe != isMe)) lawDot.push([x - 1, y - 2]);

    return lawDot;
}

//相
Graph.Law.x = function (x, y, initMap, isMe) {
    var lawDot = [];
    if (isMe == true) { //红方
        //4点半
        if (y + 2 <= 9 && x + 2 <= 8 && !initMap[y + 1][x + 1] && (!Graph.chessList2[initMap[y + 2][x + 2]] || Graph.chessList2[initMap[y + 2][x + 2]].isMe != isMe)) lawDot.push([x + 2, y + 2]);
        //7点半
        if (y + 2 <= 9 && x - 2 >= 0 && !initMap[y + 1][x - 1] && (!Graph.chessList2[initMap[y + 2][x - 2]] || Graph.chessList2[initMap[y + 2][x - 2]].isMe != isMe)) lawDot.push([x - 2, y + 2]);
        //1点半
        if (y - 2 >= 5 && x + 2 <= 8 && !initMap[y - 1][x + 1] && (!Graph.chessList2[initMap[y - 2][x + 2]] || Graph.chessList2[initMap[y - 2][x + 2]].isMe != isMe)) lawDot.push([x + 2, y - 2]);
        //10点半
        if (y - 2 >= 5 && x - 2 >= 0 && !initMap[y - 1][x - 1] && (!Graph.chessList2[initMap[y - 2][x - 2]] || Graph.chessList2[initMap[y - 2][x - 2]].isMe != isMe)) lawDot.push([x - 2, y - 2]);
    } else {
        //4点半
        if (y + 2 <= 4 && x + 2 <= 8 && !initMap[y + 1][x + 1] && (!Graph.chessList2[initMap[y + 2][x + 2]] || Graph.chessList2[initMap[y + 2][x + 2]].isMe != isMe)) lawDot.push([x + 2, y + 2]);
        //7点半
        if (y + 2 <= 4 && x - 2 >= 0 && !initMap[y + 1][x - 1] && (!Graph.chessList2[initMap[y + 2][x - 2]] || Graph.chessList2[initMap[y + 2][x - 2]].isMe != isMe)) lawDot.push([x - 2, y + 2]);
        //1点半
        if (y - 2 >= 0 && x + 2 <= 8 && !initMap[y - 1][x + 1] && (!Graph.chessList2[initMap[y - 2][x + 2]] || Graph.chessList2[initMap[y - 2][x + 2]].isMe != isMe)) lawDot.push([x + 2, y - 2]);
        //10点半
        if (y - 2 >= 0 && x - 2 >= 0 && !initMap[y - 1][x - 1] && (!Graph.chessList2[initMap[y - 2][x - 2]] || Graph.chessList2[initMap[y - 2][x - 2]].isMe != isMe)) lawDot.push([x - 2, y - 2]);
    }
    return lawDot;
}

//士
Graph.Law.s = function (x, y, initMap, isMe) {
    var lawDot = [];
    if (isMe == true) { //红方
        //4点半
        if (y + 1 <= 9 && x + 1 <= 5 && (!Graph.chessList2[initMap[y + 1][x + 1]] || Graph.chessList2[initMap[y + 1][x + 1]].isMe != isMe)) lawDot.push([x + 1, y + 1]);
        //7点半
        if (y + 1 <= 9 && x - 1 >= 3 && (!Graph.chessList2[initMap[y + 1][x - 1]] || Graph.chessList2[initMap[y + 1][x - 1]].isMe != isMe)) lawDot.push([x - 1, y + 1]);
        //1点半
        if (y - 1 >= 7 && x + 1 <= 5 && (!Graph.chessList2[initMap[y - 1][x + 1]] || Graph.chessList2[initMap[y - 1][x + 1]].isMe != isMe)) lawDot.push([x + 1, y - 1]);
        //10点半
        if (y - 1 >= 7 && x - 1 >= 3 && (!Graph.chessList2[initMap[y - 1][x - 1]] || Graph.chessList2[initMap[y - 1][x - 1]].isMe != isMe)) lawDot.push([x - 1, y - 1]);
    } else {
        //4点半
        if (y + 1 <= 2 && x + 1 <= 5 && (!Graph.chessList2[initMap[y + 1][x + 1]] || Graph.chessList2[initMap[y + 1][x + 1]].isMe != isMe)) lawDot.push([x + 1, y + 1]);
        //7点半
        if (y + 1 <= 2 && x - 1 >= 3 && (!Graph.chessList2[initMap[y + 1][x - 1]] || Graph.chessList2[initMap[y + 1][x - 1]].isMe != isMe)) lawDot.push([x - 1, y + 1]);
        //1点半
        if (y - 1 >= 0 && x + 1 <= 5 && (!Graph.chessList2[initMap[y - 1][x + 1]] || Graph.chessList2[initMap[y - 1][x + 1]].isMe != isMe)) lawDot.push([x + 1, y - 1]);
        //10点半
        if (y - 1 >= 0 && x - 1 >= 3 && (!Graph.chessList2[initMap[y - 1][x - 1]] || Graph.chessList2[initMap[y - 1][x - 1]].isMe != isMe)) lawDot.push([x - 1, y - 1]);
    }
    return lawDot;

}

//将
Graph.Law.j = function (x, y, initMap, isMe) {
    var lawDot = [];
    var isNull = (function (y1, y2) {
        var y1 = Graph.chessList2["j0"].y;
        var x1 = Graph.chessList2["J0"].x;
        var y2 = Graph.chessList2["J0"].y;
        for (var i = y1 - 1; i > y2; i--) {
            if (initMap[i][x1]) return false;
        }
        return true;
    })();

    if (isMe == true) { //红方
        //下
        if (y + 1 <= 9 && (!Graph.chessList2[initMap[y + 1][x]] || Graph.chessList2[initMap[y + 1][x]].isMe != isMe)) lawDot.push([x, y + 1]);
        //上
        if (y - 1 >= 7 && (!Graph.chessList2[initMap[y - 1][x]] || Graph.chessList2[initMap[y - 1][x]].isMe != isMe)) lawDot.push([x, y - 1]);
        //老将对老将的情况
        if (Graph.chessList2["j0"].x == Graph.chessList2["J0"].x && isNull) lawDot.push([Graph.chessList2["J0"].x, Graph.chessList2["J0"].y]);

    } else {
        //下
        if (y + 1 <= 2 && (!Graph.chessList2[initMap[y + 1][x]] || Graph.chessList2[initMap[y + 1][x]].isMe != isMe)) lawDot.push([x, y + 1]);
        //上
        if (y - 1 >= 0 && (!Graph.chessList2[initMap[y - 1][x]] || Graph.chessList2[initMap[y - 1][x]].isMe != isMe)) lawDot.push([x, y - 1]);
        //老将对老将的情况
        if (Graph.chessList2["j0"].x == Graph.chessList2["J0"].x && isNull) lawDot.push([Graph.chessList2["j0"].x, Graph.chessList2["j0"].y]);
    }
    //右
    if (x + 1 <= 5 && (!Graph.chessList2[initMap[y][x + 1]] || Graph.chessList2[initMap[y][x + 1]].isMe != isMe)) lawDot.push([x + 1, y]);
    //左
    if (x - 1 >= 3 && (!Graph.chessList2[initMap[y][x - 1]] || Graph.chessList2[initMap[y][x - 1]].isMe != isMe)) lawDot.push([x - 1, y]);
    return lawDot;
}

//炮
Graph.Law.p = function (x, y, initMap, isMe) {
    var lawDot = [];
    //左侧检索
    var n = 0;
    for (var i = x - 1; i >= 0; i--) {
        if (initMap[y][i]) {
            if (n == 0) {
                n++;
                continue;
            } else {
                if (Graph.chessList2[initMap[y][i]].isMe != isMe) lawDot.push([i, y]);
                break
            }
        } else {
            if (n == 0) lawDot.push([i, y])
        }
    }
    //右侧检索
    var n = 0;
    for (var i = x + 1; i <= 8; i++) {
        if (initMap[y][i]) {
            if (n == 0) {
                n++;
                continue;
            } else {
                if (Graph.chessList2[initMap[y][i]].isMe != isMe) lawDot.push([i, y]);
                break
            }
        } else {
            if (n == 0) lawDot.push([i, y])
        }
    }
    //上检索
    var n = 0;
    for (var i = y - 1; i >= 0; i--) {
        if (initMap[i][x]) {
            if (n == 0) {
                n++;
                continue;
            } else {
                if (Graph.chessList2[initMap[i][x]].isMe != isMe) lawDot.push([x, i]);
                break
            }
        } else {
            if (n == 0) lawDot.push([x, i])
        }
    }
    //下检索
    var n = 0;
    for (var i = y + 1; i <= 9; i++) {
        if (initMap[i][x]) {
            if (n == 0) {
                n++;
                continue;
            } else {
                if (Graph.chessList2[initMap[i][x]].isMe != isMe) lawDot.push([x, i]);
                break
            }
        } else {
            if (n == 0) lawDot.push([x, i])
        }
    }
    return lawDot;
}

//卒
Graph.Law.z = function (x, y, initMap, isMe) {
    var lawDot = [];
    if (isMe == true) { //红方
        //上
        if (y - 1 >= 0 && (!Graph.chessList2[initMap[y - 1][x]] || Graph.chessList2[initMap[y - 1][x]].isMe != isMe)) lawDot.push([x, y - 1]);
        //右
        if (x + 1 <= 8 && y <= 4 && (!Graph.chessList2[initMap[y][x + 1]] || Graph.chessList2[initMap[y][x + 1]].isMe != isMe)) lawDot.push([x + 1, y]);
        //左
        if (x - 1 >= 0 && y <= 4 && (!Graph.chessList2[initMap[y][x - 1]] || Graph.chessList2[initMap[y][x - 1]].isMe != isMe)) lawDot.push([x - 1, y]);
    } else {
        //下
        if (y + 1 <= 9 && (!Graph.chessList2[initMap[y + 1][x]] || Graph.chessList2[initMap[y + 1][x]].isMe != isMe)) lawDot.push([x, y + 1]);
        //右
        if (x + 1 <= 8 && y >= 5 && (!Graph.chessList2[initMap[y][x + 1]] || Graph.chessList2[initMap[y][x + 1]].isMe != isMe)) lawDot.push([x + 1, y]);
        //左
        if (x - 1 >= 0 && y >= 5 && (!Graph.chessList2[initMap[y][x - 1]] || Graph.chessList2[initMap[y][x - 1]].isMe != isMe)) lawDot.push([x - 1, y]);
    }

    return lawDot;
}

Graph.Law.c = function (x, y, initMap, isMe) {
    var lawDot = [];
    //左侧检索
    for (var i = x - 1; i >= 0; i--) {
        if (initMap[y][i]) {
            if (Graph.chessList2[initMap[y][i]].isMe != isMe) lawDot.push([i, y]);
            break
        } else {
            lawDot.push([i, y])
        }
    }
    //右侧检索
    for (var i = x + 1; i <= 8; i++) {
        if (initMap[y][i]) {
            if (Graph.chessList2[initMap[y][i]].isMe != isMe) lawDot.push([i, y]);
            break
        } else {
            lawDot.push([i, y])
        }
    }
    //上检索
    for (var i = y - 1; i >= 0; i--) {
        if (initMap[i][x]) {
            if (Graph.chessList2[initMap[i][x]].isMe != isMe) lawDot.push([x, i]);
            break
        } else {
            lawDot.push([x, i])
        }
    }
    //下检索
    for (var i = y + 1; i <= 9; i++) {
        if (initMap[i][x]) {
            if (Graph.chessList2[initMap[i][x]].isMe != isMe) lawDot.push([x, i]);
            break
        } else {
            lawDot.push([x, i])
        }
    }
    return lawDot;
}
Graph.init();
ChessGame.init();