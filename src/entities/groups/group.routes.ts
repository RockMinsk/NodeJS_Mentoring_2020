import { Router } from 'express';
import { groupController } from './group.controller';
import { validateSchema } from '../../utils/validation';
import { groupSchemas, groupUsersSchemas, validationTarget } from './group.validation';

export const groupRoute = Router();

groupRoute.all('/:id', validateSchema(groupSchemas.id, validationTarget.id));
groupRoute.all('/:id/addUsers', validateSchema(groupSchemas.id, validationTarget.id));

groupRoute.route('/')
    .get(groupController.getAll)
    .post(validateSchema(groupSchemas.addGroup, validationTarget.addGroup), groupController.add);

groupRoute.route('/:id')
    .get(groupController.getById)
    .put(validateSchema(groupSchemas.updateGroup, validationTarget.updateGroup), groupController.update)
    .delete(groupController.delete);

groupRoute.route('/:id/addUsers')
    .post(validateSchema(groupUsersSchemas.addUsers, validationTarget.addUsers), groupController.addUsers);