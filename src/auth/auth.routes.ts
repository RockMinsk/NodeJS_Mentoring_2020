import { Request, Response, Router } from 'express';
import * as path from 'path';
import { checkAuth } from './auth.middleware';
import { AuthController } from './auth.controller';
import { validateSchema } from '../utils/validation';
import { authSchemas, validationTarget } from './auth.validation';

export const authRoute = Router();

const authController = new AuthController();

authRoute.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

authRoute.post('/login', authController.login);

authRoute.post('/token', validateSchema(authSchemas.token, validationTarget.token), authController.refreshToken);

// authRoute.get('/home', checkAuth, (req: Request, res: Response) => {
//     res.send('Congratulations, you have successfully logged in!');
// });

authRoute.post('/logout', checkAuth, authController.logout);
