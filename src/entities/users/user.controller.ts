import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userService } from './user.service';
import { UserInterface } from './user.interface';
import { MESSAGES } from '../../constants/constants';
import { logger } from '../../utils/logger/logger.config';
import { authService } from '../../auth/auth.service';

const entityNameForMessage = 'User';

class UserController {

    getAll = async(req: Request, res: Response, next: NextFunction) => {
        const { loginSubstring, limit } = req.query;
        try {
            const items: Array<UserInterface> = await userService.getAll(`${loginSubstring}`, +limit!);
            if (!items || items.length === 0) {
                res.json([]);
            } else {
                res.json(items);
            }
            return next();
        } catch (err) {
            return next(err);
        }
    };
    
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const item: UserInterface | null = await userService.getById(id);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                res.status(404).json({ error: true, message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                res.json(item);
                return next();
            }
        } catch (err) {
            return next(err);
        }
    };
    
    add = async (req: Request, res: Response, next: NextFunction) => {
        const itemRequest = req.body;
        const item: UserInterface = {
            id: uuidv4(),
            ...itemRequest,
            is_deleted: false
        };
        try {
            const isLoginExists: boolean = !!(await userService.getAnyByLogin(item.login))
            if (isLoginExists) {
                logger.error(MESSAGES.NAME_UNIQUENESS);
                return res.status(409).json({ error: true, message: MESSAGES.NAME_UNIQUENESS });
            } else {
                const request = await userService.add(item);
                return res.status(201).json(request);
            }
        } catch (err) {
            return next(err);
        }
    }
    
    update = async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { login } = req.body;
        try {
            if (login) {
                const isLoginExists: boolean = !!(await userService.getAnyByLogin(login));
                if (isLoginExists) {
                    logger.error(MESSAGES.NAME_UNIQUENESS);
                    return res.status(409).json({ error: true, message: MESSAGES.NAME_UNIQUENESS });
                } 
            }
            const item: UserInterface | null = await userService.update(id, req.body);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                res.status(404).json({ error: true, message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                res.json(item);
            }
            return next();
        } catch (err) {
            return next(err);
        } 
    }
    
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const item: UserInterface | null = await userService.softDelete(id);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                return res.status(404).json({ error: true, message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                await authService.delete(id);
                return res.json({ message: MESSAGES.ITEM_DELETED(entityNameForMessage, id) });
            }
        } catch (err) {
            return next(err);
        } 
    }
}

export const userController = new UserController();
