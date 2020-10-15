import { MESSAGES } from '../constants/constants';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from './logger/logger.config';
import { setTextColor, COLORS } from './logger/helpers/colorize-text';

export const checkIfRouterExists = (req: Request, res: Response, next: NextFunction) => {
    if (!req.route) {
        logger.error(`Router ${setTextColor(req.originalUrl, COLORS.FgCyan)} doesn't exist`)
        res.sendStatus(404);
    } else {
        return next();
    }
}

export const errorHandlerGlobal = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${MESSAGES.SERVER_ERROR} ${err}`);
    res.sendStatus(500);
    next(err);
};

const errorResponse = (schemaErrors: Object[]) => {
    const errors = schemaErrors.map((error: any) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

export const validateSchema = (schema: any, property: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(property === 'body' ? req.body : req.params, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            const jsonError: Object = errorResponse(error.details);
            logger.error(`Validation error: ${JSON.stringify(jsonError)}`);
            res.status(400).json(jsonError);
        } else {
            return next();
        }
    };
};
