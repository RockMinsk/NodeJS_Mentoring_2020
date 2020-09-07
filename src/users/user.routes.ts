import { Router } from 'express';
import { UserController } from './user.controller';
import { checkAuth, validateSchema } from '../utils/validation';
import { userSchemas, validationTarget } from './user.validation';

export const userRoute = Router();

const userController = new UserController();

userRoute.all('/*', checkAuth);
userRoute.all('/:id', validateSchema(userSchemas.id, validationTarget.id));

userRoute.route('/')
    .get(userController.getUsers)
    .post(validateSchema(userSchemas.addUser, validationTarget.addUser), userController.addUser);

userRoute.route('/:id')
    .get(userController.getUserById)
    .put(validateSchema(userSchemas.updateUser, validationTarget.updateUser), userController.updateUser)
    .delete(userController.deleteUser);
