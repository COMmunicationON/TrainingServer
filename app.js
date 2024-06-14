const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const dotenv = require('dotenv');
dotenv.config();

const trainingRouter = require('./src/routes/trainingRouter');
const userRouter = require('./src/routes/userRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = MongoStore.create({
  mongoUrl: process.env.SESSION_DB_URI,
  collectionName: 'sessions'
})

app.use(session({
  secret: `${process.env.SESSION_KEY}`,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },  // 세션 타임아웃을 1시간으로 설정
  store: sessionStore
}));




app.use('/training', trainingRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
