var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

require('dotenv').config();
require('./controllers/db/connection');
require('./controllers/db/setup');

var auth = require('./controllers/api/utilities/auth')

var companyRouter = require('./controllers/api/company/index');
var productRouter = require('./controllers/api/product/index');
var transactionRouter = require('./controllers/api/transaction/index');
var pocRouter = require('./controllers/api/validation/index'); //proof of concept router

var app = express();

//to get rid of the CORS issue
app.use(function(req, res, next) {
  var allowedOrigins = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://localhost:5000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.header('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === 'OPTIONS') {
      var headers = {
          "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
          "Access-Control-Allow-Credentials" : true
      };
      res.writeHead(200, headers);
      res.end();
  } else {
      next();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/company', companyRouter);
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);
app.use('/poc', pocRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
