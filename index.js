const serverless = require('serverless-http');
const express = require('express');
const boolParser = require('express-query-boolean');
const password = require('./password.js');

const app = express();
app.use(boolParser());

app.get('/', (req, res) => {
    res.send({
        message: "Welcome to Tipuch's Lab",
        endpoints: [
            {
                name: 'home',
                endpoint: `${req.protocol}://${req.hostname}${req.originalUrl}`
            },
            {
                name: 'password generator',
                endpoint: `${req.protocol}://${req.hostname}${req.originalUrl}password/`
            },
            {
                name: 'coin flip',
                endpoint: `${req.protocol}://${req.hostname}${req.originalUrl}coinflip/`
            }
        ]
    });
});

app.get('/password/', (req, res) => {
    const passLength =
        req.query.passLength === undefined ? undefined : parseInt(req.query.passLength, 10);

    if (passLength !== undefined && Number.isNaN(passLength)) {
        res.status(400).send({ message: 'passLength needs to be an integer.' });
    }

    const hasPunctuation =
        req.query.hasPunctuation === undefined ? undefined : Boolean(req.query.hasPunctuation);
    const hasUpper = req.query.hasUpper === undefined ? undefined : Boolean(req.query.hasUpper);
    const hasNumbers =
        req.query.hasNumbers === undefined ? undefined : Boolean(req.query.hasNumbers);
    res.send({
        message:
            'This is your password :) (you can use parameters ' +
            'passLength, hasPunctuation, hasUpper and hasNumbers in the url query to modify the result)',
        password: password.generatePassword(passLength, hasPunctuation, hasUpper, hasNumbers)
    });
});

app.get('/coinflip/', (_, res) => {
    const result = Math.round(Math.random()) === 0 ? 'heads' : 'tails';
    res.send({
        message: 'You flipped a coin and got:',
        coinflip: result
    });
});

app.get('/dices/', (req, res) => {
    let pattern = /^([d][0-9]+)/;
    let dice_results = {
        message: 'Here are your dice results:'
    };
    for (let dice in req.query) {
        if (dice.match(pattern)) {
            let dice_number = parseInt(req.query[dice]);
            if (!Number.isNaN(dice_number)) {
                // roll dices here
                let dice_size = parseInt(dice.substring(1));
                for (let i = 1; i <= dice_number; i++) {
                    let result = Math.floor(1 + Math.random() * dice_size);
                    dice_results[`${dice} (${i})`] = result;
                }
            }
        }
    }
    res.send(dice_results);
});

module.exports.handler = serverless(app);
