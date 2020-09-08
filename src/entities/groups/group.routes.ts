import { Router } from 'express';
import { GroupController } from './group.controller';
import { checkAuth, validateSchema } from '../../utils/validation';
import { groupSchemas, validationTarget } from './group.validation';

export const groupRoute = Router();

const groupController = new GroupController();

groupRoute.all('/*', checkAuth);
groupRoute.all('/:id', validateSchema(groupSchemas.id, validationTarget.id));

groupRoute.route('/')
    .get(groupController.getAll)
    .post(validateSchema(groupSchemas.addGroup, validationTarget.addGroup), groupController.add);

groupRoute.route('/:id')
    .get(groupController.getById)
    .put(validateSchema(groupSchemas.updateGroup, validationTarget.updateGroup), groupController.update)
    .delete(groupController.delete);
