var express = require('express');

var indexRouter = require('./routes/index');
var walletsRouter = require('./routes/wallets');
const ErrorResponse = require('./util/ErrorResponse');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/wallets', walletsRouter);

app.use((req, res, next) => res.status(404).send(ErrorResponse("Resource not found")));

module.exports = app;
