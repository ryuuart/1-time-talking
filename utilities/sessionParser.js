const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// We need the same instance of the session parser in express and 
// Websocket server.
let sessionParser = session({
    name: 'time-talking.sid',
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
});

module.exports = sessionParser;