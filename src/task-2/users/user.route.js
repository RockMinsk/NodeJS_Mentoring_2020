import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { localStorage } from './users.js';
import { checkAuth, validateSchema, getAutoSuggestedItems } from '../utils/utils.js';
import { userSchemas } from './user.model';

export let userRoute = express.Router();

userRoute.all('/api/*', checkAuth);
userRoute.all('/api/users/:id', validateSchema(userSchemas.id, 'params'));

userRoute.route('/api/users')
    .get((req, res, next) => {
        const activeUsers = localStorage.filter(user => !user.isDeleted);
        const { loginSubstring, limit } = req.query;
        const filteredUsers = getAutoSuggestedItems(activeUsers, 'login', loginSubstring, limit);
        if (!localStorage || filteredUsers.length === 0) {
            res.status(404).json({ message: 'No users found.' });
        } else {
            res.json(filteredUsers);
            next();
        }
    })
    .post(validateSchema(userSchemas.user, 'body'), (req, res) => {
    const userRequest = req.body;
    const user = {
        id: uuidv4(),
        ...userRequest,
        isDeleted: false
    };
        localStorage.push(user);
        res.json(localStorage.filter(user => !user.isDeleted));
    });

userRoute.route('/api/users/:id')
    .get((req, res, next) => {
        console.log(req.params);
        const { id } = req.params;
        const user = localStorage.filter(user => user.id === id && user.isDeleted === false);

        if (!user[0]) {
            res.status(404).json({ message: `User with id ${id} not found.` });
        } else {
            res.json(user[0]);
            next();
        }
    })
    .put(validateSchema(userSchemas.user, 'body'), (req, res, next) => {
        const { id } = req.params;
        const user = localStorage.find(user => user.id === id);
        const index = localStorage.indexOf(user);
        const keys = Object.keys(req.body);

        keys.forEach(key => {
            key === 'age' ? user[key] = +req.body[key] : user[key] = req.body[key];
        });
        localStorage[index] = user;
        res.json(localStorage[index]);
        next();
    })
    .delete((req, res) => {
        const { id } = req.params;
        const user = localStorage.filter(user => user.id === id)[0];

        user.isDeleted = true;
        res.json({ message: `User ${id} deleted` });
    });
