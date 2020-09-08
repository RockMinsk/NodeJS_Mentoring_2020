import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GroupService } from './group.service';
import { GroupInterface } from './group.interface';
import { MESSAGES } from '../../constants/constants';

const groupService = new GroupService();
const entityNameForMessage = 'Group';

export class GroupController {

    getAll = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const items: Array<GroupInterface> = await groupService.getAll();
            if (!items || items.length === 0) {
                // TODO: clarify what response it's better
                res.json([]);
                // res.status(404).json({ message: MESSAGES.ITEMS_NOT_FOUND('Groups') });
            } else {
                res.json(items);
                return next();
            }
        } catch (err) {
            console.error(`${MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    };
    
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const item: GroupInterface | null = await groupService.getById(id);
            if (!item) {
                res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                res.json(item);
                return next();
            }
        } catch (err) {
            console.error(`${MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    };
    
    add = async (req: Request, res: Response) => {
        const itemRequest = req.body;
        const item: GroupInterface = {
            id: uuidv4(),
            ...itemRequest
        };
        try {
            const isLoginExists: boolean = !!(await groupService.getByName(item.name))
            if (isLoginExists) {
                return res.status(409).json({ message: MESSAGES.LOGIN_UNIQUENESS })
            } else {
                const request = await groupService.add(item);
                return res.status(201).json(request);
            }
        } catch (err) {
            console.error(`${MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    }
    
    update = async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const item: GroupInterface | null = await groupService.update(id, req.body);
            if (!item) {
                res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                res.json(item);
            }
            return next();
        } catch (err) {
            console.error(`${MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        } 
    }
    
    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const item: number | null = await groupService.delete(id);
            if (!item) {
                return res.status(404).json({ message: MESSAGES.ITEM_NOT_FOUND(entityNameForMessage, id) });
            } else {
                return res.json({ message: MESSAGES.ITEM_DELETED(entityNameForMessage, id) });
            }
        } catch (err) {
            console.error(`${MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        } 
    }
}
