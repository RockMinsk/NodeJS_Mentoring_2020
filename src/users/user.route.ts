import { Router } from 'express';
import { getUsers, getUserById, addUser, updateUser, deleteUser } from './user.controller';
import * as utils from '../utils/utils';
import { userSchemas, validationTarget } from './user.validation';

export const userRoute = Router();

// userRoute.all('/*', utils.checkAuth);
userRoute.all('/:id', utils.validateSchema(userSchemas.id, validationTarget.id));

userRoute.route('/')
    .get(getUsers)
    .post(utils.validateSchema(userSchemas.addUser, validationTarget.addUser), /*utils.isItemUnique(localStorage, 'login'),*/ addUser);

userRoute.route('/:id')
    .get(getUserById)
    .put(utils.validateSchema(userSchemas.updateUser, validationTarget.updateUser), updateUser)
    .delete(deleteUser);
