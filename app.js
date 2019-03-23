var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

require('dotenv').config();
require('./controllers/db/connection');
require('./controllers/db/setup');

var companyRouter = require('./controllers/api/company/index');
var productRouter = require('./controllers/api/product/index');
var transactionRouter = require('./controllers/api/transaction/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/company', companyRouter);
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);

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
