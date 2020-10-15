import * as Joi from 'joi';

const TOKEN: Joi.StringSchema = Joi.string();

export const authSchemas = {
    token: Joi.object({
        token: TOKEN.required()
    })
};

export const validationTarget = {
    token: 'body'
}
