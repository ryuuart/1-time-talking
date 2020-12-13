'use strict';

const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require("./routes");
const sessionParser = require("./utilities/sessionParser");

const app = express();

// Enable CORS
app.use(cors({ origin: /http:\/\/localhost:*\d*/, credentials: true }));

app.use(express.static('public'));
app.use(sessionParser);
app.use(express.json());

app.use('/', routes);

let server = http.createServer(app);

module.exports = server;