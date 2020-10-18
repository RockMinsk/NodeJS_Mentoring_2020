import { Request, Response, NextFunction } from "express";
import { MESSAGES, SECURITY } from "../constants/constants";
import { logger } from "../utils/logger/logger.config";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserService } from "../entities/users/user.service";
import { UserInterface } from "../entities/users/user.interface";
import { AuthService } from "./auth.service";

const userService = new UserService();
const authService = new AuthService();

const signTokens = async(req: Request, res: Response, next: NextFunction, expectedUser: UserInterface) => {
    const payload: Object = { sub: expectedUser.id, name: expectedUser.login }
    const accessToken: string = jwt.sign(payload, SECURITY.ACCESS_TOKEN_SECRET, { algorithm: "HS256", expiresIn: SECURITY.ACCESS_TOKEN_LIFE });
    const refreshToken: string = jwt.sign(payload, SECURITY.REFRESH_TOKEN_SECRET, { algorithm: "HS256", expiresIn: SECURITY.REFRESH_TOKEN_LIFE });
    const response: Object = {
        status: "Logged in",
        accessToken: accessToken,
        refreshToken: refreshToken
    }
    try {
        await authService.updateToken(expectedUser.id, refreshToken);
    } catch (err) {
        return next(err);
    }
    return res.json(response);
}

export class AuthController {
    login = async(req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;
        let expectedUser: UserInterface | null;
        try {
            expectedUser = await userService.getActiveByLogin(login);
        } catch (err) {
            return next(err);
        }
        if (!expectedUser || !expectedUser.password || !(await bcrypt.compare(password, expectedUser.password))) {
            logger.error(MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS);
            return res.status(401).json({ error: true, message: MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS });
        } else {
            return signTokens(req, res, next, expectedUser);
        }
    }

    refreshToken = async(req: Request, res: Response, next: NextFunction) => {
        let refreshToken = req.body.token
        let expectedToken: string | null;
        let expectedUser: UserInterface | null;
        let decoded: Object;
        try {
            decoded = jwt.verify(refreshToken, SECURITY.REFRESH_TOKEN_SECRET);
        } catch (err) {
            logger.error(MESSAGES.AUTHORIZATION_INVALID_TOKEN);
            return res.status(403).json({ error: true, message: MESSAGES.AUTHORIZATION_INVALID_TOKEN });
        }
        const userId: string = Object(decoded).sub;
        try {
            expectedToken = await authService.getTokenByUserId(userId);
        } catch (err) {
            return next(err);
        }
        if (expectedToken && expectedToken === refreshToken) {
            try {
                expectedUser = await userService.getById(userId);
                if (!expectedUser) {
                    logger.error(MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS);
                    return res.status(401).json({ error: true, message: MESSAGES.AUTHORIZATION_INVALID_CREDENTIALS });
                } else {
                    await authService.updateToken(expectedUser.id, null);
                    logger.info(`User "${Object(decoded).name}" refreshed tokens`);
                    return signTokens(req, res, next, expectedUser);
                }
            } catch (err) {
                return next(err);
            }
        } else {
            logger.error(MESSAGES.AUTHORIZATION_NO_ACTIVE_USER_TOKEN);
            return res.status(401).json({ error: true, message: MESSAGES.AUTHORIZATION_NO_ACTIVE_USER_TOKEN });
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
