var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require("mongoose");
let cron = require("node-schedule");
const macAddr = require("getmac");
require("dotenv").config();

db_host = process.env.DB_HOST;
db_user = process.env.DB_USER;
db_pass = process.env.DB_PASS;
macAddressGlobal = "";

macAddr.getMac(function (err, mac) {
  if (err) {
    console.log(err);
  }
  let splitChar = mac[2];
  macAddressGlobal = (mac.split(splitChar)).toString();
});

//load babel(es6)
require("babel-core/register");
require("babel-polyfill");

//load keys
const keys = require("./config/keys");

//map global promise
mongoose.promise = global.promise;

//Mongoose connect
mongoose.Promise = global.Promise;
let connection = mongoose
  .connect(keys.mongoURI)
  .then(console.log("MongoDb Connected"))
  .catch(err => {
    if (err) {
      return handleError(err);
    }
  });

//load model
require("./models/relayQueue");

var indexRouter = require('./routes/index');
var handleControllerRouter = require("./routes/handleController");
var handleRelayRouter = require("./routes/handleRelay");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/handleController", handleControllerRouter);
app.use("handleRelay", handleRelayRouter);

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

let GetRalayQueueData = require("./classes/GetRelayQueueData");

let tempTest = cron.scheduleJob("*/1 * * * *", function () {
  new GetRalayQueueData.default();
});

module.exports = app;