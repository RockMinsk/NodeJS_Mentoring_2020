import express from 'express';
import session from 'express-session';
import { loginRoute } from './auth/login.route';
import { userRoute } from './entities/users/user.routes';
import { groupRoute } from './entities/groups/group.routes';
import { logoutRoute } from './auth/logout.route';
import { errorHandlerGlobal } from './utils/validation'
import { HOSTNAME, PORT, COOKIE_SECRET, COOKIE_AGE } from './constants/constants';

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

app.use(loginRoute);
app.use('/api/users', userRoute);
app.use('/api/groups', groupRoute);
app.use('/logout', logoutRoute);

app.use(errorHandlerGlobal);

app.listen(PORT, HOSTNAME, () =>
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`)
);
