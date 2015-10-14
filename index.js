'use strict';

require('dotenv').load();

var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();

require('./config/views')(app);
require('./config/mailer')(app);

var sslKey = null;
var sslCert = null;
var sslCa = null;
var ssl = true;

try {
  sslKey = fs.readFileSync('./config/server.key');
  sslCert = fs.readFileSync('./config/server.crt');
  sslCa = fs.readFileSync('./config/ca.crt');
} catch (e) {
  ssl = false;
}

mongoose.connect(process.env.MONGO_URL);

require('lib/user-updater').startTimer();

app.use('/static', express.static('assets/dist'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.use('/api', require('./routes/api'));

var server;

if (ssl) {
  server = https.createServer({
    key: sslKey,
    cert: sslCert,
    ca: sslCa,
    requestCert: true,
    rejectUnauthorized: false
  }, app);
} else {
  server = http.createServer(app);
}

var listener = server.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + listener.address().port);
});
