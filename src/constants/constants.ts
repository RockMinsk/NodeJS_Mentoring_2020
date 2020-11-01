import 'dotenv/config';

export const HOSTNAME: string = process.env.HOSTNAME || 'localhost';
export const PORT: number = Number(process.env.PORT) || 3000;

const DB_HOSTNAME: string = process.env.DB_HOSTNAME || 'localhost';
const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
const DB_USER: string = process.env.DB_USER || 'postgres';
const DB_PASSWORD: string = process.env.DB_PASSWORD || 'system';
const DB_DIALECT: string = process.env.DB_DIALECT || 'postgres';
export const DB_SCHEMA_NAME: string = process.env.DB_SCHEMA_NAME || 'public';
export const DB_SYNC_FORCE: boolean = !!process.env.DB_SYNC_FORCE && process.env.DB_SYNC_FORCE === 'false' ? false : true || true;
export const BCRYPT_IS_USED: boolean = !!process.env.BCRYPT_IS_USED && process.env.BCRYPT_IS_USED === 'false' ? false : true || true;

export const DB_CONNECTION_PROPERTIES: Object = {
    host: DB_HOSTNAME,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: DB_DIALECT
};

export const SECURITY = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'changeit',
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '1m',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'changeit',
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '1d'
}

export const MESSAGES = {
    ITEMS_NOT_FOUND: (itemName: string) => `${itemName} not found`,
    SOME_ITEMS_NOT_FOUND: (itemName1: string, itemName2: string) => `${itemName1} or ${itemName2} not found`,
    ITEM_NOT_FOUND: (itemName: string, id: string) => `${itemName} with id ${id} not found`,
    ITEM_NOT_CREATED: (itemName: string) => `${itemName} is not created`,
    ITEM_DELETED: (itemName: string, id: string) => `${itemName} with id ${id} deleted`,
    NAME_UNIQUENESS: `Name should be unique`,
    SERVER_ERROR: `The following error occurred:`,
    AUTHORIZATION_INVALID_CREDENTIALS: `Invalid username or password`,
    AUTHORIZATION_MISSING_CREDENTIALS: `Please enter username and password`,
    AUTHORIZATION_NO_ACTIVE_USER: (login: string) => `There is no one active user with login "${login}"`,
    AUTHORIZATION_NO_ACTIVE_USER_TOKEN: `There is no one active user with expected token`,
    AUTHORIZATION_NO_TOKEN: `No token provided`,
    AUTHORIZATION_INVALID_TOKEN: `Failed to autenticate token`
}

export const SENSITIVE_DATA = [
    'password',
    'token'
];
