import express from 'express';
import * as path from 'path';
import { checkAuth } from '../utils/utils';
import { localStorage } from '../users/users.js';

export let loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

loginRouter.post('/login', (req, res) => {
    const { login, password } = req.body;
    if (login && password) {
        const expectedUser = localStorage.find(user => user.login === login);
        if (expectedUser && expectedUser.password === password) {
            req.session.loggedin = true;
            req.session.login = login;
            res.redirect('/home');
        } else {
            res.status(401).send('Invalid username or password');
        }
        res.end();
    } else {
        res.send('Please enter username and assword');
        res.end();
    }
});

loginRouter.get('/home', checkAuth, (req, res) => {
    res.send('Congratulations, you have successfully logged in!');
});
