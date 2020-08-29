import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { RequestUser } from '../users/user';
import { UserInterface } from '../users/user.type';

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

export const validateItemExistence = (obj: Object[]) => {
    return (req: RequestUser, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const item: any = obj.find((elem: any) => elem.id === id && elem.isDeleted === false);

        if (!item) {
            res.status(404).json({ message: `Item with id ${id} not found.` });
        } else {
            req.item = item;
            return next();
        }
    };
};

export const validateItemUniqueness = (obj: Object[], key: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const isParamNotUnique: any = obj.find((elem: any) => elem[key] === req.body[key]);

        if (isParamNotUnique) {
            res.status(409).json({ message: `The "${key}" value is not unique` });
        } else {
            return next();
        }
    };
};

export const getAutoSuggestedItems = (obj: Array<UserInterface>, itemSubstring: any, limit: any) => {
    let filteredItems: Array<UserInterface>;
    if (itemSubstring) {
        filteredItems = obj.filter(({ login }) => login.includes(itemSubstring));
        filteredItems.sort((a: UserInterface, b: UserInterface) => (a.login > b.login) ? 1 : ((b.login > a.login) ? -1 : 0));
    } else {
        filteredItems = obj;
    }
    if (limit && limit <= filteredItems.length) {
        filteredItems.length = limit;
    }
    return filteredItems;
};
