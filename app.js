const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require('./src/routes/indexRouter');
const trainingRouter = require('./src/routes/trainingRouter');
const saveRouter = require('./src/routes/saveDataRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: `${process.env.SESSION_KEY}`,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },  // 세션 타임아웃을 1시간으로 설정
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_DB_URI,
  }),
}));


app.use('/', indexRouter);
app.use('/training', trainingRouter);
app.use('/saveData', saveRouter);

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
