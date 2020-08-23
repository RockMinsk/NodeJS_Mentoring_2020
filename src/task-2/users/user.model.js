import * as Joi from 'joi';

export const userSchemas = {
    user: Joi.object().keys({
        login: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_ ]{3,30}$')).required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
        age: Joi.number().integer().$.min(4).max(130).rule({ message: 'Age must be between 4 and 130' }).required(),
        isDeleted: Joi.boolean()
    }),
    id: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required()
    })
};
