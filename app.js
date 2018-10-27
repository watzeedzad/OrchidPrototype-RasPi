var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require("mongoose");
let cron = require("node-schedule");
const macAddr = require("getmac");
var cors = require("cors");
require("dotenv").config();

db_host = process.env.DB_HOST;
db_user = process.env.DB_USER;
db_pass = process.env.DB_PASS;
server_host = process.env.SERVER_HOST;
macAddressGlobal = "";

// macAddr.getMac(function (err, mac) {
//   if (err) {
//     console.log(err);
//   }
//   let splitChar = mac[2];
//   macAddressGlobal = (mac.split(splitChar)).toString();
//   macAddressGlobal = macAddressGlobal.toLowerCase();
// });

macAddressGlobal = "b8,27,eb,a7,78,ad";

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
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(console.log("MongoDb Connected"))
  .catch(err => {
    if (err) {
      console.log(err);
    }
  });

//load model
require("./models/relayQueue");
require("./models/relayManualQueue");
require("./models/knowController");
require("./models/tempGreenHouseData");
require("./models/tempProjectData");
require("./models/tempFertilizeringHistory");
require("./models/tempWateringHistory");
require("./models/Project");

var indexRouter = require('./routes/index');
var handleControllerRouter = require("./routes/handleController");
var handleFlowVolume = require("./routes/handleFlowVolume");

var app = express();

app.use(cors({
  methods: ["GET", "POST"]
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/handleController", handleControllerRouter);
app.use("/handleFlowVolume", handleFlowVolume);

let GetRalayQueueData = require("./classes/GetRelayQueueData");
let GetManualRelayQueueData = require("./classes/GetManualRelayQueueData");
let SummarySensorData = require("./classes/SummarySensorData");

let tempTest = cron.scheduleJob("*/30 * * * * *", function () {
  new GetRalayQueueData.default();
  new GetManualRelayQueueData.default();
  new SummarySensorData.default();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("404: File Not Found");
});

module.exports = app;