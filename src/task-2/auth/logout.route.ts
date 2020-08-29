import { Request, Response, Router } from 'express';

export const logoutRoute = Router();

logoutRoute.get('/', (req: Request, res: Response) => {
    req.session!.loggedin = false;
    delete req.session?.login;
    req.session
    res.redirect('/');
});
