'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');
const chalk = require("chalk");
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const WebSocket = require('ws');
const { Mongoose } = require('mongoose');

const app = express();
const map = new Map();

// We need the same instance of the session parser in express and 
// Websocket server.
let sessionParser = session({
    name: 'time-talking.sid',
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false,
    store: new MongoStore({
        url: 'mongodb://localhost:27017'
    })
});

//
// Serve static files from the 'public' folder.
//
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.static('public'));
app.use(sessionParser);
app.use(express.json());

app.post('/login', function (req, res) {
    // "Log in" user and set userId to session.

    const id = uuid.v4();

    console.log(`Updating session for ${id}`);
    req.session.userId = id;
    req.session.userName = req.body.userName;

    console.log(chalk.green("[SESSION] \n"), req.session);
    console.log(chalk.green("[SESSION] -- Session ID: "), req.sessionID)

    res.send({ result: 'OK', message: 'Session updated' });
})

app.delete('/logout', function (request, response) {
    const ws = map.get(request.session.userId);

    console.log('Destroying session');
    request.session.destroy(function () {
        if (ws) ws.close();

        response.send({ result: 'OK', message: 'Session destryoed' });
    });
});

// Create servers
const server = http.createServer(app);
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

    // socket.on('message', function (message) {
    //     // Here we can now use session parameters.
    //     console.log(`Received message ${message} from user ${userId}`);
    // });

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

server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://localhost:' + process.env.PORT);
});