export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const PORT = Number(process.env.PORT) || 3000;

export const COOKIE_SECRET = 'nodejs mentoring';
export const COOKIE_AGE = 60000 * 60 * 24;
