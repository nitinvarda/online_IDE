var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hackerEarth = require('hackerearth-node');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var hackerEarth = new hackerEarth(process.env.HACKER_EARTH
  //Your Client Secret Key here this is mandatory
  //mode sync=1 or async(optional)=0 or null async is by default and preferred for nodeJS
);

app.post("/compile", (req, res) => {

  // if (req.body.lang == null) {
  //   return res.json({ error: "please select a language first" })
  // }
  // else {


  var config = {};
  config.time_limit = 1;  //your time limit in integer
  config.memory_limit = 323244;  //your memory limit in integer
  config.source = req.body.source;  //your source code for which you want to use hackerEarth api
  config.input = req.body.inputs;  //input against which you have to test your source code
  config.language = req.body.lang; //optional choose any one of them or none
  //compile your code 
  hackerEarth.compile(config)
    .then(result => {
      //Handle Result
      res.json(JSON.parse(result));
    })
    .catch(err => {
      //Handle Error
      res.json(err)
    });
  // }
})

app.post("/run", (req, res) => {

  var config = {};
  config.time_limit = 1;  //your time limit in integer
  config.memory_limit = 323244;  //your memory limit in integer
  config.source = req.body.source;  //your source code for which you want to use hackerEarth api
  config.input = req.body.inputs;  //input against which you have to test your source code
  config.language = req.body.lang; //optional choose any one of them or none

  hackerEarth.run(config, function (err, response) {
    if (err)
      res.send(err);
    else
      //deal with response
      res.json(JSON.parse(response));  //you can use it in your own way
  });
})




app.use('/', indexRouter);
app.use('/users', usersRouter);


// heroku production build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}


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
