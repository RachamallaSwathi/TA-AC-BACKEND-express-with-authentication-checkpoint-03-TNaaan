var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var session=require('express-session');
var MongoStore = require('connect-mongo');
var flash=require('connect-flash');
var auth=require('./middlewares/auth');
var nodemailer = require('nodemailer');
var dotenv=require('dotenv').config();



var passport=require('passport');
require('./modules/passport');
require('./middlewares/sendMail');




var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
//var commentsRouter=require('./routes/comments');
//var verifyemailRouter = require('./routes/verifyEmail');
var usersRouter = require('./routes/users');

var app = express();

//connect to database
mongoose.connect('mongodb://localhost/expanse-tracker',(err)=>{
  console.log(err?err:'Connected to Database');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  store:  MongoStore.create({mongoUrl:'mongodb://localhost/expanse-tracker'})
}))

app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());


app.use(auth.userInfo);

//nodemailer





app.use('/', indexRouter);
app.use('/articles', articlesRouter);
//app.use('/comments',commentsRouter);
//app.use('/verifyEmail', verifyemailRouter);
app.use('/users',usersRouter);

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