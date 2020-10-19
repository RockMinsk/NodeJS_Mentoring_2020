import { MESSAGES } from '../constants/constants';
import * as Joi from 'joi';

const LOGIN: Joi.StringSchema = Joi.string().messages({ 'any.required': MESSAGES.AUTHORIZATION_MISSING_CREDENTIALS });;
const PASSWORD: Joi.StringSchema = Joi.string().messages({ 'any.required': MESSAGES.AUTHORIZATION_MISSING_CREDENTIALS });;
const TOKEN: Joi.StringSchema = Joi.string();

export const authSchemas = {
    login: Joi.object().keys({
        login: LOGIN.required(),
        password: PASSWORD.required()
    }),
    token: Joi.object({
        token: TOKEN.required()
    })
};

export const validationTarget = {
    login: 'body',
    token: 'body'
}
