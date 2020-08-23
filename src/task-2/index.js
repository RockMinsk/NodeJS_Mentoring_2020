import express from 'express';
import session from 'express-session';
import { loginRouter } from './auth/login.route.js';
import { userRoute } from './users/user.route.js';
import { logoutRouter } from './auth/logout.route.js';
import { HOSTNAME, PORT, COOKIE_SECRET, COOKIE_AGE } from './constants';

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

app.use(loginRouter);
app.use(userRoute);
app.use(logoutRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next(err);
});

app.listen(PORT, HOSTNAME, () =>
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`)
);
