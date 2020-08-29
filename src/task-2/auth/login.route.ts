import { Request, Response, Router } from 'express';
import * as path from 'path';
import { checkAuth } from '../utils/utils';
import { localStorage } from '../users/user.storage';

export const loginRoute = Router();

loginRoute.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

loginRoute.post('/login', (req: Request, res: Response) => {
    const { login, password } = req.body;
    if (login && password) {
        const expectedUser = localStorage.find(user => user.login === login);
        if (expectedUser && expectedUser.password === password) {
            req.session!.loggedin = true;
            req.session!.login = login;
            res.redirect('/home');
        } else {
            res.status(401).send('Invalid username or password');
        }
        res.end();
    } else {
        res.send('Please enter username and password');
        res.end();
    }
});

loginRoute.get('/home', checkAuth, (req: Request, res: Response) => {
    res.send('Congratulations, you have successfully logged in!');
});