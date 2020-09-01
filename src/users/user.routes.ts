import { Router } from 'express';
import { getUsers, getUserById, addUser, updateUser, deleteUser } from './user.controller';
import { checkAuth, validateSchema } from '../utils/validation';
import { userSchemas, validationTarget } from './user.validation';

export const userRoute = Router();

userRoute.all('/*', checkAuth);
userRoute.all('/:id', validateSchema(userSchemas.id, validationTarget.id));

userRoute.route('/')
    .get(getUsers)
    .post(validateSchema(userSchemas.addUser, validationTarget.addUser), addUser);

userRoute.route('/:id')
    .get(getUserById)
    .put(validateSchema(userSchemas.updateUser, validationTarget.updateUser), updateUser)
    .delete(deleteUser);
