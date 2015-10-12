'use strict';

var express = require('express');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
require('dotenv').load();
var app = express();

mongoose.connect(process.env.MONGO_URL);

var env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

env.addFilter('calEscape', function (text) {
  return text
    .replace(/\,\;/g, function (match) { return '\\' + match; })
    .replace(/(\r\n|\n|\r)/gm, '\\n');
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.use('/api', require('./routes/api'));

var listener = app.listen(3000, function () {
  console.log('Listening on port ' + listener.address().port);
});
