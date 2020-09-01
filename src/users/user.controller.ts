import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUsersFromDb, getUserByIdFromDb, addNewUserInDb, updateUserInDb, softDeleteFromDb } from './user.service';
import { UserInterface } from './user.type';
import { getAutoSuggestedItems } from '../utils/utils';

export const getUsers = async(req: Request, res: Response, next: NextFunction) => {
    const { loginSubstring, limit } = req.query;
    const filteredUsers = getAutoSuggestedItems(await getUsersFromDb(), loginSubstring, limit);
    if (!filteredUsers || filteredUsers.length === 0) {
        res.status(404).json({ message: `Users not found.` });
    } else {
        res.json(filteredUsers);
        return next();
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: UserInterface = await getUserByIdFromDb(id);
    if (!user) {
        res.status(404).json({ message: `User with id ${id} not found.` });
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
    res.status(201).json(await addNewUserInDb(user));
}

export const updateUser = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: UserInterface = await updateUserInDb(id, req.body);
    if (!user) {
        res.status(404).json({ message: `User with id ${id} not found.` });
    } else {
        res.json(user);
    }
    next();
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: UserInterface = await getUserByIdFromDb(id);
    if (!user) {
        res.status(404).json({ message: `User with id ${id} not found.` });
    } else {
        await softDeleteFromDb(id);
        res.json({ message: `User with id ${user.id} deleted` });
    }
}
