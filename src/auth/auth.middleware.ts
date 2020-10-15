import { MESSAGES, SECURITY } from '../constants/constants';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger/logger.config';
import * as jwt from 'jsonwebtoken';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (accessToken) {
        return jwt.verify(accessToken, SECURITY.ACCESS_TOKEN_SECRET, function(err: any, decoded: any) {
            if (err) {
                logger.error(MESSAGES.AUTHORIZATION_INVALID_TOKEN);
                return res.status(403).json({
                    'error': true,
                    'message': MESSAGES.AUTHORIZATION_INVALID_TOKEN
                })
            }
            return next();
        });
    } else {
        logger.error(MESSAGES.AUTHORIZATION_NO_TOKEN);
        return res.status(401).json({
            'error': true,
            'message': MESSAGES.AUTHORIZATION_NO_TOKEN
        })
    };
};
