const serverless = require('serverless-http');
const express = require('express');
const password = require('./password.js');

const app = express();

app.get('/', (req, res) => {
    res.send({
        message: "Welcome to Tipuch's Lab",
        endpoints: [
            {
                name: 'home',
                endpoint: `https://${req.hostname}/`
            },
            { name: 'password generator', endpoint: `https://${req.hostname}/password/` }
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

module.exports.handler = serverless(app);
