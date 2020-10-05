import express from 'express';
import session from 'express-session';
import { loginRoute } from './auth/login.route';
import { userRoute } from './entities/users/user.routes';
import { groupRoute } from './entities/groups/group.routes';
import { logoutRoute } from './auth/logout.route';
import { checkIfRouterExists, errorHandlerGlobal } from './utils/validation'
import { performanceLogger, requestLogger } from './utils/logger/middlewares'
import { HOSTNAME, PORT, COOKIE_SECRET, COOKIE_AGE } from './constants/constants';
import { dbSync } from './db/dbConnection';
import { logger } from './utils/logger/logger.config';

const app = express();

app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: COOKIE_SECRET,
    cookie: { maxAge: COOKIE_AGE },
    resave: true,
    saveUninitialized: true
}));

app.use(requestLogger);
app.use(performanceLogger);

app.use(loginRoute);
app.use('/api/users', userRoute);
app.use('/api/groups', groupRoute);
app.use('/logout', logoutRoute);

app.use(checkIfRouterExists);
app.use(errorHandlerGlobal);

const startAppWithDbSynchronization = async() => {
    await dbSync();
    app.listen(PORT, HOSTNAME, () => console.log(`\x1b[32mApplication is running at http://${HOSTNAME}:${PORT}\x1b[0m`)
    );
};

startAppWithDbSynchronization();

process.on('uncaughtException', err => {
    logger.error(err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    logger.error(err);
});
