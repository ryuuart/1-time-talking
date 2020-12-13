const express = require('express');
const uuid = require('uuid');
const chalk = require('chalk');

const router = express.Router()

router
    .route('/login')
    .post(function (req, res) {
        // "Log in" user and set userId to session.

        const id = uuid.v4();

        console.log(`Updating session for ${id}`);
        req.session.userId = id;
        req.session.userName = req.body.userName;

        console.log(chalk.green("[SESSION] \n"), req.session);
        console.log(chalk.green("[SESSION] -- Session ID: "), req.sessionID)

        res.send({ result: 'OK', message: 'Session updated' });
    })

router
    .route('/logout')
    .post(function (request, response) {
        const ws = map.get(request.session.userId);

        console.log('Destroying session');
        request.session.destroy(function () {
            if (ws) ws.close();

            response.send({ result: 'OK', message: 'Session destryoed' });
        });
    })

module.exports = router;