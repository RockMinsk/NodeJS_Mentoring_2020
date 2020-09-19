import 'dotenv/config';

export const HOSTNAME: string = process.env.HOSTNAME || 'localhost';
export const PORT: number = Number(process.env.PORT) || 3000;

const DB_HOSTNAME: string = process.env.DB_HOSTNAME || 'localhost';
const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
const DB_USER: string = process.env.DB_USER || 'postgres';
const DB_PASSWORD: string = process.env.DB_PASSWORD || 'system';
const DB_DIALECT: string = process.env.DB_DIALECT || 'postgres';

export const DB_CONNECTION_PROPERTIES: Object = {
    host: DB_HOSTNAME,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: DB_DIALECT
};

export const COOKIE_SECRET: string = 'nodejs mentoring';
export const COOKIE_AGE: number = 60000 * 60 * 24;

export const MESSAGES = {
    ITEMS_NOT_FOUND: (itemName: string) => `${itemName} not found.`,
    ITEM_NOT_FOUND: (itemName: string, id: string) => `${itemName} with id ${id} not found.`,
    ITEM_NOT_CREATED: (itemName: string) => `${itemName} is not created.`,
    ITEM_DELETED: (itemName: string, id: string) => `${itemName} with id ${id} deleted`,
    LOGIN_UNIQUENESS: `Login should be unique`,
    SERVER_ERROR: `The following error occurred:`
}