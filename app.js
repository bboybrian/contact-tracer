var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var db = require('./database');

var adminRouter = require('./routes/admin');
var databaseRouter = db.router;
var database = db.database;
var sessionRouter = require('./routes/session');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'supersecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use('/', sessionRouter);
app.use('/admin', adminRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/db', databaseRouter);

module.exports = app;
