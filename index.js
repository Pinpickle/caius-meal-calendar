'use strict';

require('dotenv').load();

var express = require('express');
var mongoose = require('mongoose');
var app = express();

require('./config/views')(app);

mongoose.connect(process.env.MONGO_URL);

app.use('/static', express.static('assets/dist'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.use('/api', require('./routes/api'));

var listener = app.listen(3000, function () {
  console.log('Listening on port ' + listener.address().port);
});
