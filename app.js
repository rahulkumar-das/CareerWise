require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

require("./mvc/models/db")
var indexRouter = require('./mvc/routes/index');
var usersRouter = require('./mvc/routes/users');
var forgotRouter = require('./mvc/routes/forgot')

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'mvc' ,'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res, next){
  res.statusJson = function(statusCode, data){
    let obj={
      ...data,
      statusCode: statusCode
    }
    res.status(statusCode).json(obj); 
  }
  next();
})

app.use(passport.initialize());


app.use('/',(req,res,next)=>{
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://career-wise-o2ssmrj5q-careerwise-2026.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  } else if (!origin) {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:4200');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', forgotRouter);

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
  res.render('error');
});

module.exports = app;
