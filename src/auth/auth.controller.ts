import { Request, Response, NextFunction } from "express";
import { MESSAGES, SECURITY } from "../constants/constants";
import { logger } from "../utils/logger/logger.config";
import * as jwt from 'jsonwebtoken';
import { UserService } from "../entities/users/user.service";
import { UserInterface } from "../entities/users/user.interface";
import { AuthService } from "./auth.service";
import { AuthInterface } from "./auth.interface";

const userService = new UserService();
const authService = new AuthService();

export class AuthController {
    login = async(req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;
        if (login && password) {
            let expectedUser;
            try {
                expectedUser = await userService.getActiveByLogin(login);
            } catch (err) {
                return next(err);
            }
            if (!expectedUser || expectedUser.password !== password) {
                logger.error(MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS);
                return res.status(403).json({ error: true, message: MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS });
            } else {
                const payload = { sub: expectedUser.id, name: expectedUser.login }
                const accessToken = jwt.sign(payload, SECURITY.ACCESS_TOKEN_SECRET, { algorithm: "HS256", expiresIn: SECURITY.ACCESS_TOKEN_LIFE });
                const refreshToken = jwt.sign(payload, SECURITY.REFRESH_TOKEN_SECRET, { algorithm: "HS256", expiresIn: SECURITY.REFRESH_TOKEN_LIFE });
                const response = {
                    status: "Logged in",
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
                await authService.updateToken(expectedUser.id, refreshToken);
                return res.json(response);
            }
        } else {
            logger.error(MESSAGES.AUTHORIZATION_MISSING_CREDENTIALS);
            res.status(401).json({ error: true, message: MESSAGES.AUTHORIZATION_MISSING_CREDENTIALS });
        }
    }

    refreshToken = async(req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.body.token
        let expectedUserToken: AuthInterface | null;
        let expectedUser: UserInterface | null;
        try {
            expectedUserToken = await authService.getUserToken(refreshToken);
        } catch (err) {
            return next(err);
        }
        if (expectedUserToken) {
            try {
                expectedUser = await userService.getById(expectedUserToken!.user_id);
            } catch (err) {
                return next(err);
            }
            jwt.verify(refreshToken, SECURITY.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
                if (err) {
                    logger.error(MESSAGES.AUTHORIZATION_INVALID_TOKEN);
                    return res.status(403).json({ error: true, message: MESSAGES.AUTHORIZATION_INVALID_TOKEN })
                }
                const payload = { sub: expectedUser!.id }
                const accessToken = jwt.sign(payload, SECURITY.ACCESS_TOKEN_SECRET, { algorithm: "HS256", expiresIn: SECURITY.ACCESS_TOKEN_LIFE });
                return res.json({ accessToken: accessToken });
            })
        } else {
            logger.error(MESSAGES.AUTHORIZATION_NO_ACTIVE_USER_TOKEN);
            res.status(401).json({ error: true, message: MESSAGES.AUTHORIZATION_NO_ACTIVE_USER_TOKEN });
        }

    }

    logout = async(req: Request, res: Response, next: NextFunction) => {
        const { login } = req.body;
        let expectedUser;
        try {
            expectedUser = await userService.getActiveByLogin(login);
        } catch (err) {
            return next(err);
        }
        if (expectedUser) {
            await authService.updateToken(expectedUser.id, null);
        } else {
            logger.error(MESSAGES.AUTHORIZATION_NO_ACTIVE_USER(login));
        }
        res.redirect('/');
    }
}
