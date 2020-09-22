import * as Joi from 'joi';

const ID: Joi.StringSchema = Joi.string().guid({ version: ['uuidv4'] });

const LOGIN_PATTERN: RegExp = new RegExp('^[a-zA-Z0-9_ ]{3,30}$');
const LOGIN_ERROR_MESSAGE: string = 'Login must contain A-Z, a-z, 0-9, _. Minimum length is 3, maximim length is 30 characters.';
const LOGIN: Joi.StringSchema = Joi.string().$.pattern(LOGIN_PATTERN).rule({ message: LOGIN_ERROR_MESSAGE });

const PASSWORD_PATTERN: RegExp = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$');
const PASSWORD_ERROR_MESSAGE: string = 'Password must contain at least one letter and one number. Minimum 8 character.';
const PASSWORD: Joi.StringSchema = Joi.string().$.pattern(PASSWORD_PATTERN).rule({ message: PASSWORD_ERROR_MESSAGE});

const AGE_ERROR_MESSAGE: string = 'Age must be between 4 and 130.';
const AGE: Joi.NumberSchema = Joi.number().integer().strict().$.min(4).max(130).rule({ message: AGE_ERROR_MESSAGE });

const IS_DELETED: Joi.BooleanSchema = Joi.boolean().strict();

export const userSchemas = {
    id: Joi.object({
        id: ID.required()
    }),
    addUser: Joi.object().keys({
        login: LOGIN.required(),
        password: PASSWORD.required(),
        age: AGE.required(),
        isDeleted: IS_DELETED.required()
    }),
    updateUser: Joi.object().keys({
        login: LOGIN,
        password: PASSWORD,
        age: AGE
    })
};

export const validationTarget = {
    id: 'params',
    addUser: 'body',
    updateUser: 'body'
}
