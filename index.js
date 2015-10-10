var express = require('express');
var Browser = require('zombie');
var nunjucks = require('nunjucks');
var UserMocker = require('lib/user-mocker');
var cheerio = require('cheerio');
var app = express();



var env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

env.addFilter('calEscape', function (text) {
  return text
    .replace(/\,\;/g, function (match) { return '\\' + match })
    .replace(/(\r\n|\n|\r)/gm, '\\n');
});

app.get('/', function (req, res) {
  var user = new UserMocker();

  user
    // .loginFromSomething
    .done(function () {
      console.log(JSON.stringify({ cok: user.getCookies() }));
      user.getMealsInfo().then(function (infos) {
        console.log(infos);
        res.render('calendar.ical', {
          email: 'cas217@cam.ac.uk',
          user: 'cas217',
          events: infos
        });
      });
    });
});

var listener = app.listen(3000, function () {
  console.log('Listening on port ' + listener.address().port);
});
