import { Request, Response, NextFunction, Router } from 'express';
import { RequestUser } from './user'
import { v4 as uuidv4 } from 'uuid';
import { localStorage } from './user.storage';
import * as utils from '../utils/utils';
import { userSchemas, validationTarget } from './user.validation';
import { UserInterface } from './user.type';

export const userRoute = Router();

userRoute.all('/*', utils.checkAuth);
userRoute.all('/:id', utils.validateSchema(userSchemas.id, validationTarget.id), utils.validateItemExistence(localStorage));

userRoute.route('/')
    .get((req: Request, res: Response, next: NextFunction) => {
        const activeUsers = localStorage.filter(user => !user.isDeleted);
        // TODO: create interface
        const { loginSubstring, limit } = req.query;
        const filteredUsers = utils.getAutoSuggestedItems(activeUsers, loginSubstring, limit);
        if (!localStorage || filteredUsers.length === 0) {
            res.status(404).json({ message: 'No users found.' });
        } else {
            res.json(filteredUsers);
            return next();
        }
    })
    .post(utils.validateSchema(userSchemas.addUser, validationTarget.addUser), utils.validateItemUniqueness(localStorage, 'login'), (req: Request, res: Response) => {
        const userRequest = req.body;
        const user: UserInterface = {
            id: uuidv4(),
            ...userRequest,
            isDeleted: false
        };
        localStorage.push(user);
        res.status(201).json(localStorage.find(elem => elem.id === user.id));
    });

userRoute.route('/:id')
    .get((req: RequestUser, res: Response, next: NextFunction) => {
        res.json(req.item);
        next();
    })
    .put(utils.validateSchema(userSchemas.updateUser, validationTarget.updateUser), (req: RequestUser, res: Response, next: NextFunction) => {
        const user: UserInterface = req.item!;
        const index: number = localStorage.indexOf(user);
        const keys: string[] = Object.keys(req.body);

        keys.forEach((key: string) => user[key] = req.body[key]);
        localStorage[index] = user;
        res.json(localStorage[index]);
        next();
    })
    .delete((req: RequestUser, res: Response) => {
        const user: UserInterface = req.item!;
        user.isDeleted = true;
        res.json({ message: `User with id ${user.id} deleted` });
    });
