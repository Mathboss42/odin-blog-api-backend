var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');

require('./passportConfig');

var app = express();

app.use(cors());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.URL_MONGO;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, {authSource: "admin"});
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('app.js app.use LOG REQUEST BODY AT BEGINNING', (req, res, next) => {console.log(req.body); next()});

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
