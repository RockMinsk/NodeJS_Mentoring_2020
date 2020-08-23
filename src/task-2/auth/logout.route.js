import express from 'express';

export const logoutRouter = express.Router();

logoutRouter.get('/logout', (req, res) => {
    req.session.loggedin = false;
    delete req.session.login;
    res.redirect('/');
});
