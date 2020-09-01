export const HOSTNAME: string = process.env.HOSTNAME || 'localhost';
export const PORT: number = Number(process.env.PORT) || 3000;

export const DB_HOSTNAME: string = process.env.DB_HOSTNAME || 'localhost';
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
export const DB_USER: string = process.env.DB_USER || 'postgres';
export const DB_PASSWORD: string = process.env.DB_PASSWORD || 'system';

export const COOKIE_SECRET: string = 'nodejs mentoring';
export const COOKIE_AGE: number = 60000 * 60 * 24;
