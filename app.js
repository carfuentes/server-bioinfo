var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var passport = require('./config/passport');


var categoryApi = require('./routes/category-api');
var commentApi = require('./routes/comment-api');
var workflowApi = require('./routes/workflow-api');
var userAuth = require('./routes/user-auth');

// database connection
require('./config/database');

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', userAuth);
app.use('/api',  passport.authenticate('jwt', {session: false}), workflowApi);
app.use('/api',  passport.authenticate('jwt', {session: false}), commentApi);
app.use('/api',  passport.authenticate('jwt', {session: false}), categoryApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
