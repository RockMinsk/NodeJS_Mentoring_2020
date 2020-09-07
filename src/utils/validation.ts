import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session!.loggedin) {
        res.status(403).send('You are not authorized to view this page. Please login to the application.');
    } else {
        return next();
    }
};

export const errorHandlerGlobal = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Something broke!');
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
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };
};
