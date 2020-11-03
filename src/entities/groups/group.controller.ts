import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { groupService } from './group.service';
import { GroupInterface } from './group.interface';
import { MESSAGES } from '../../constants/constants';
import { logger } from '../../utils/logger/logger.config';

const entityNameForMessage = 'Group';
const entityNameAdditionalForMessage = 'User';

export class GroupController {

    getAll = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const items: Array<GroupInterface> = await groupService.getAll();
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
            const item: GroupInterface | null = await groupService.getById(id);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
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
        const item: GroupInterface = {
            id: uuidv4(),
            ...itemRequest
        };
        try {
            const isLoginExists: boolean = !!(await groupService.getByName(item.name))
            if (isLoginExists) {
                logger.error(MESSAGES.NAME_UNIQUENESS);
                return res.status(409).json({ message: MESSAGES.NAME_UNIQUENESS })
            } else {
                const request = await groupService.add(item);
                return res.status(201).json(request);
            }
        } catch (err) {
            return next(err);
        }
    }

    addUsers = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { userIds } = req.body;
        try {
            const items = await groupService.addUsers(id, userIds);
            if (!items) {
                logger.error(MESSAGES.SOME_ITEMS_NOT_FOUND(entityNameForMessage, entityNameAdditionalForMessage));
                return res.status(404).json({ message: MESSAGES.SOME_ITEMS_NOT_FOUND(entityNameForMessage, entityNameAdditionalForMessage) });
            } else {
                return res.json(items);
            }
        } catch (err) {
            return next(err);
        }
    }
    
    update = async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            if (name) {
                const isLoginExists: boolean = !!(await groupService.getByName(name));
                if (isLoginExists) {
                    logger.error(MESSAGES.NAME_UNIQUENESS);
                    return res.status(409).json({ error: true, message: MESSAGES.NAME_UNIQUENESS });
                } 
            }
            const item: GroupInterface | null = await groupService.update(id, req.body);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
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
            const item: number | null = await groupService.delete(id);
            if (!item) {
                logger.error(MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id));
                return res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                return res.json({ message: MESSAGES.ITEM_DELETED(entityNameForMessage, id) });
            }
        } catch (err) {
            return next(err);
        } 
    }
}

export const groupController = new GroupController();
