import express from 'express';

export const logoutRoute = express.Router();

logoutRoute.get('/', (req, res) => {
    req.session.loggedin = false;
    delete req.session.login;
    res.redirect('/');
});
