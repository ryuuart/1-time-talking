
const mongoose = require('mongoose');
const chalk = require("chalk");

require('dotenv').config();
const server = require('./app');
const wss = require('./controller/wsserver');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log(chalk.greenBright("Connected to MongoDB"));

    server.listen(parseInt(process.env.PORT) + 1 || 3000, function () {
        console.log('Listening on http://localhost:' + (parseInt(process.env.PORT) + 1));
    });
});

process.on('SIGTERM', () => {
    console.log(chalk.red("SIGTERM received"));
    if (server) {
        server.close();
    }
});