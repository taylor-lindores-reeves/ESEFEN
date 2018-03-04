const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo')(session);
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const pug = require('pug');
const app = express();
const index = require('./entities/index');
const admin = require('./entities/admin/admin.routes');
const users = require('./entities/user/user.routes');
const helpers = require('./helpers')

const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');
require('./handlers/mail');

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Setting the templating engine to pug and declaring where express looks for cdertain files
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname)));

// Validation checks that entered values are appropriate for each field values have been supplied for all required fields.
// Sanitization removes/replaces characters in the data that might potentially be used to send malicious content to the server.
app.use(expressValidator());

// Create a session middleware with the given options
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    User: new connectMongo({ mongooseConnection: mongoose.connection }),
}))


// Passport is authentication middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});
// Route handlers
app.use('/', index);
app.use('/admin', admin);
app.use('/users', users);

// Error handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.flashValidationErrors);
app.use(errorHandlers.productionErrors);
if (app.get('env') === 'development') { app.use(errorHandlers.developmentErrors); }

module.exports = app;