import express from 'express';

export let logoutRouter = express.Router();

logoutRouter.get('/logout', (req, res) => {
    req.session.loggedin = false;
    delete req.session.login;
    res.redirect('/');
});
