import { Request, Response, NextFunction, Router } from 'express';
import * as path from 'path';
import { checkAuth } from '../utils/validation';
import { UserService } from '../entities/users/user.service';

export const loginRoute = Router();

const userService = new UserService();

loginRoute.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

loginRoute.post('/login', async(req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    if (login && password) {
        let expectedUser;
        try {
            expectedUser = await userService.getActiveByLogin(login);
        } catch (err) {
            return next(err);
        }
        if (expectedUser && expectedUser.password === password) {
            req.session!.loggedin = true;
            req.session!.login = login;
            res.redirect('/home');
        } else {
            res.status(401).send('Invalid username or password');
        }
        return res.end();
    } else {
        res.send('Please enter username and password');
        res.end();
    }
});

loginRoute.get('/home', checkAuth, (req: Request, res: Response) => {
    res.send('Congratulations, you have successfully logged in!');
});
