'use strict';

const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require("./routes");
const sessionParser = require("./utilities/sessionParser");
const path = require("path");

const app = express();

// Serve React website if in Heroku
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', function(req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, "build")});
    })
}

// Enable CORS
app.use(cors({ origin: [/http:\/\/localhost:*\d*/, /http:\/\/192.168.1.172:*\d*/, /https:\/\/time-talking-app.herokuapp.com:*\d*/], credentials: true }));

app.use(express.static('public'));
app.use(sessionParser);
app.use(express.json());

app.use('/', routes);

let server = http.createServer(app);

module.exports = server;