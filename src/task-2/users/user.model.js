import * as Joi from 'joi';

export const userSchemas = {
    user: Joi.object().keys({
        login: Joi.string().$.pattern(new RegExp('^[a-zA-Z0-9_ ]{3,30}$'))
            .rule({ message: 'Password must contain A-Z, a-z, 0-9, _. Minimum length is 3, maximim length is 30 characters.' }).required(),
        password: Joi.string().$.pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$'))
            .rule({ message: 'Password must contain at least one letter and one number. Minimum 8 character.' }).required(),
        age: Joi.number().integer().$.min(4).max(130).rule({ message: 'Age must be between 4 and 130.' }).required(),
        isDeleted: Joi.boolean()
    }),
    id: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required()
    })
};
