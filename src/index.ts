import express from 'express';
import cors from 'cors';
import { authRoute } from './auth/auth.routes';
import { userRoute } from './entities/users/user.routes';
import { groupRoute } from './entities/groups/group.routes';
import { checkIfRouterExists, errorHandlerGlobal } from './utils/validation';
import { checkAuth } from './auth/auth.middleware';
import { performanceLogger, requestLogger } from './utils/logger/middlewares';
import { HOSTNAME, PORT } from './constants/constants';
import { dbSync } from './db/dbConnection';
import { logger } from './utils/logger/logger.config';

const app = express();

const corsOptions = {
    "origin": `http://${HOSTNAME}:${PORT}`
  }

app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(performanceLogger);

app.use(cors(corsOptions));

app.use('/', authRoute);
app.use('/api', checkAuth);
app.use('/api/users', userRoute);
app.use('/api/groups', groupRoute);

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

process.on('unhandledRejection', err => logger.error(err));
