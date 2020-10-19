import { Router } from 'express';
import { UserController } from './user.controller';
import { validateSchema } from '../../utils/validation';
import { userSchemas, validationTarget } from './user.validation';

export const userRoute = Router();

const userController = new UserController();

userRoute.all('/:id', validateSchema(userSchemas.id, validationTarget.id));

userRoute.route('/')
    .get(userController.getAll)
    .post(validateSchema(userSchemas.addUser, validationTarget.addUser), userController.add);

userRoute.route('/:id')
    .get(userController.getById)
    .put(validateSchema(userSchemas.updateUser, validationTarget.updateUser), userController.update)
    .delete(userController.delete);
