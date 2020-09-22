import * as Joi from 'joi';

const ID: Joi.StringSchema = Joi.string().guid({ version: ['uuidv4'] });

const NAME_PATTERN: RegExp = new RegExp('^[a-zA-Z0-9_ ]{3,50}$');
const NAME_ERROR_MESSAGE: string = 'Group name must contain A-Z, a-z, 0-9, _. Minimum length is 3, maximim length is 50 characters.';
const NAME: Joi.StringSchema = Joi.string().$.pattern(NAME_PATTERN).rule({ message: NAME_ERROR_MESSAGE });

const PERMISSIONS: Joi.ArraySchema = Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'));

const USER_IDS:  Joi.ArraySchema = Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }));

export const groupSchemas = {
    id: Joi.object({
        id: ID.required()
    }),
    addGroup: Joi.object().keys({
        name: NAME.required(),
        permissions: PERMISSIONS.required(),
    }),
    updateGroup: Joi.object().keys({
        name: NAME,
        permissions: PERMISSIONS,
    })
};

export const groupUsersSchemas = {
    addUsers: Joi.object({
        userIds: USER_IDS.required()
    })
};

export const validationTarget = {
    id: 'params',
    addGroup: 'body',
    updateGroup: 'body',
    addUsers: 'body'
}
