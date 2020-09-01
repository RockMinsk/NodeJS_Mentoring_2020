import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUsersFromDb, getUserByIdFromDb, addNewUserInDb, updateUserInDb, softDeleteFromDb } from './user.service';
import { UserInterface } from './user.interface';

const MESSAGE = {
    USERS_NOT_FOUND: `Users not found.`,
    USER_NOT_FOUND: (id: string) => `User with id ${id} not found.`,
    USER_NOT_CREATED: `User is not created.`,
    USER_DELETED: (id: string) => `User with id ${id} deleted`
}

export const getUsers = async(req: Request, res: Response, next: NextFunction) => {
    const { loginSubstring, limit } = req.query;
    const users: Array<UserInterface> = await getUsersFromDb(`${loginSubstring}`, +limit!);
    if (!users || users.length === 0) {
        res.status(404).json({ message: MESSAGE.USERS_NOT_FOUND });
    } else {
        res.json(users);
        return next();
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: UserInterface = await getUserByIdFromDb(id);
    if (!user) {
        res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
    } else {
        res.json(user);
        return next();
    }
};

export const addUser = async (req: Request, res: Response) => {
    const userRequest = req.body;
    const user: UserInterface = {
        id: uuidv4(),
        ...userRequest,
        is_deleted: false
    };
    const result = await addNewUserInDb(user);
    return Object.keys(result).length === 0 && result.constructor === Object ? res.status(404).json({ message: MESSAGE.USER_NOT_CREATED })
        : Object.keys(result).length > 0 && result.constructor === Object ? res.status(201).json(result) : res.status(409).json(result);
}

export const updateUser = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: UserInterface = await updateUserInDb(id, req.body);
    if (!user) {
        res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
    } else {
        res.json(user);
    }
    next();
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: UserInterface = await getUserByIdFromDb(id);
    if (!user) {
        res.status(404).json({ message: MESSAGE.USER_NOT_FOUND(id) });
    } else {
        await softDeleteFromDb(id);
        res.json({ message: MESSAGE.USER_DELETED(id) });
    }
}
