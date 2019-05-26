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
            },
            {
                name: 'dice roller',
                endpoint: `${req.protocol}://${req.hostname}${req.originalUrl}dices/`
            }
        ]
    });
});

app.get('/password/', (req, res) => {
    /*
     * This route will generate a password with sane defaults and optional parameters.
     */
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
    /*
     * This route will flip a coin.
     */
    const result = Math.round(Math.random()) === 0 ? 'heads' : 'tails';
    res.send({
        message: 'You flipped a coin and got:',
        coinflip: result
    });
});

app.get('/dice/', (req, res) => {
    /*
     * This route will roll given dice parameters.
     */
    // this pattern (e.g: d5) is used to pass query parameters for dice.
    const pattern = /^([d][0-9]+)/;
    const diceResults = {
        message: 'Here are your dice results:'
    };
    const queryKeys = Object.keys(req.query);
    const diceSizeLimit = 1000;
    const diceNumberLimit = 1000;
    for (let i = 0; i < queryKeys.length; i += 1) {
        const dice = queryKeys[i];
        if (dice.match(pattern)) {
            const diceNumber = parseInt(req.query[dice], 10);
            if (!Number.isNaN(diceNumber)) {
                const diceSize = parseInt(dice.substring(1), 10);
                if (!(diceNumber > diceNumberLimit && diceSize > diceSizeLimit)) {
                    // roll dice here
                    for (let j = 1; j <= diceNumber; j += 1) {
                        const result = Math.floor(1 + Math.random() * diceSize);
                        diceResults[`${dice} (${j})`] = result;
                    }
                }
            }
        }
    }
    res.send(diceResults);
});

module.exports.handler = serverless(app);
