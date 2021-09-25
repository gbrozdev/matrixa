if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./connection');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const hbs = require('express-handlebars');
var app = express();
var session = require('express-session')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname + '/views/layout/',partialsDir:__dirname + '/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'Key', cookie: {maxAge: 6000000},saveUninitialized: true, resave: true}));

// app.use(session({
//   secret: 'Key',
//   name: "test",
//   cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 }, //user won't have to login for 3 days
//   store: new (require('express-session'))({
//       storage: 'mongodb',
      
//       expire: 86400 // optional 
//   })
// }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

db.connect((err)=>{
  if(err) console.log("Connection Error"+err);
  else console.log("Database connected to port")
})

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
