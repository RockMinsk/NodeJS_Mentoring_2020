import { Router } from 'express';
import { UserController } from './user.controller';
import { checkAuth, validateSchema } from '../utils/validation';
import { userSchemas, validationTarget } from './user.validation';

export const userRoute = Router();

const userControler = new UserController();

userRoute.all('/*', checkAuth);
userRoute.all('/:id', validateSchema(userSchemas.id, validationTarget.id));

userRoute.route('/')
    .get(userControler.getUsers)
    .post(validateSchema(userSchemas.addUser, validationTarget.addUser), userControler.addUser);

userRoute.route('/:id')
    .get(userControler.getUserById)
    .put(validateSchema(userSchemas.updateUser, validationTarget.updateUser), userControler.updateUser)
    .delete(userControler.deleteUser);
