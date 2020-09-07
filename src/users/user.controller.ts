import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';
import { UserInterface } from './user.interface';
import { COMMON_MESSAGES } from '../constants/constants';

const MESSAGE = {
    USERS_NOT_FOUND: `Users not found.`,
    USER_NOT_FOUND: (id: string) => `User with id ${id} not found.`,
    USER_NOT_CREATED: `User is not created.`,
    USER_DELETED: (id: string) => `User with id ${id} deleted`,
    LOGIN_UNIQUENESS: `Login should be unique`,
}

const userService = new UserService();

export class UserController {

    getUsers = async(req: Request, res: Response, next: NextFunction) => {
        const { loginSubstring, limit } = req.query;
        try {
            const users: Array<UserInterface> = await userService.getUsersFromDb(`${loginSubstring}`, +limit!);
            if (!users || users.length === 0) {
                // TODO: clarify what response it's better
                res.json([]);
                // res.status(404).json({ message: MESSAGE.USERS_NOT_FOUND });
            } else {
                res.json(users);
                return next();
            }
        } catch (err) {
            console.error(`${COMMON_MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    };
    
    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user: UserInterface | null = await userService.getUserByIdFromDb(id);
            if (!user) {
                res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
            } else {
                res.json(user);
                return next();
            }
        } catch (err) {
            console.error(`${COMMON_MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    };
    
    addUser = async (req: Request, res: Response) => {
        const userRequest = req.body;
        const user: UserInterface = {
            id: uuidv4(),
            ...userRequest,
            is_deleted: false
        };
        try {
            const isLoginExists: boolean = !!(await userService.getAnyUserByLoginFromDb(user.login))
            if (isLoginExists) {
                return res.status(409).json({ message: MESSAGE.LOGIN_UNIQUENESS })
            } else {
                const request = await userService.addNewUserInDb(user);
                return res.status(201).json(request);
            }
        } catch (err) {
            console.error(`${COMMON_MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        }
    }
    
    updateUser = async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user: UserInterface | null = await userService.updateUserInDb(id, req.body);
            if (!user) {
                res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
            } else {
                res.json(user);
            }
            return next();
        } catch (err) {
            console.error(`${COMMON_MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        } 
    }
    
    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const user: UserInterface | null = await userService.getUserByIdFromDb(id);
            if (!user) {
                return res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
            } else {
                await userService.softDeleteFromDb(id);
                return res.json({ message: MESSAGE.USER_DELETED(id) });
            }
        } catch (err) {
            console.error(`${COMMON_MESSAGES.SERVER_ERROR} ${err}`);
            return res.sendStatus(500);
        } 
    }
}
