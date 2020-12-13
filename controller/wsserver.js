const chalk = require('chalk');
const session = require('express-session');
const server = require('../app.js');
const sessionParser = require("../utilities/sessionParser");

const WebSocket = require('ws');
const map = new Map();

// Create servers
const wss = new WebSocket.Server({
    clientTracking: false,
    noServer: true
})

server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
        if (!request.session.userId) {
            console.log(chalk.redBright("🛑 NOT ALLOWED"))
            console.log(request.session)
            console.log(request.sessionID)
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        console.log('Session is parsed!');

        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    });
});

let sockets = [];
wss.on('connection', function (socket, request) {
    sockets.push(socket);

    const userId = request.session.userId;

    map.set(userId, socket);

    // When you receive a message, send that message to every socket.
    socket.on('message', function (msg) {
        console.log(`Received message ${msg} from user ${request.session.userName}`)
        sockets.forEach(s => s.send(msg));
    })

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        map.delete(userId);

        sockets = sockets.filter(s => s !== socket);
    });
});

module.exports = wss;