import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { localStorage } from './user.storage.js';
import * as utils from '../utils/utils.js';
import { userSchemas } from './user.model';

export const userRoute = express.Router();

userRoute.all('/*', utils.checkAuth);
userRoute.all('/:id', utils.validateSchema(userSchemas.id, 'params'), utils.validateItemExistence(localStorage));

userRoute.route('/')
    .get((req, res, next) => {
        const activeUsers = localStorage.filter(user => !user.isDeleted);
        const { loginSubstring, limit } = req.query;
        const filteredUsers = utils.getAutoSuggestedItems(activeUsers, 'login', loginSubstring, limit);
        if (!localStorage || filteredUsers.length === 0) {
            res.status(404).json({ message: 'No users found.' });
        } else {
            res.json(filteredUsers);
            return next();
        }
    })
    .post(utils.validateSchema(userSchemas.user, 'body'), utils.validateItemUniqueness(localStorage, 'login'), (req, res) => {
        const userRequest = req.body;
        const user = {
            id: uuidv4(),
            ...userRequest,
            isDeleted: false
        };
        localStorage.push(user);
        res.json(localStorage.find(elem => elem.id === user.id));
    });

userRoute.route('/:id')
    .get((req, res, next) => {
        res.json(req.item);
        return next();
    })
    .put(utils.validateSchema(userSchemas.user, 'body'), (req, res, next) => {
        const user = req.item;
        const index = localStorage.indexOf(user);
        const keys = Object.keys(req.body);

        keys.forEach(key => {
            return key === 'age' ? user[key] = +req.body[key] : user[key] = req.body[key];
        });
        localStorage[index] = user;
        res.json(localStorage[index]);
        next();
    })
    .delete((req, res) => {
        const user = req.item;
        user.isDeleted = true;
        res.json({ message: `User with id ${user.id} deleted` });
    });
