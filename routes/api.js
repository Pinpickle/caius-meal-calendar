'use strict';

var express = require('express');
var User = require('lib/user');
var UserMocker = require('lib/user-mocker');
var bodyParser = require('body-parser');
var _ = require('lodash');

var api = new express.Router();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.get('/calendar/:slug', function (req, res, next) {
  var slug = req.params.slug;
  var userMocker = new UserMocker();
  var user;
  var infos;

  User.findOne({ slug: slug })
    .then(function (u) {
      if (!u) {
        var err = new Error('We don\'t have that calendar');
        err.status = 404;
        throw err;
      }

      user = u;
      return userMocker.loginFromCookies(user.cookies);
    })
    .then(function () {
      return userMocker.getMealsInfo();
    })
    .then(function (i) {
      infos = i;
      user.cookies = userMocker.getCookies();
      return user.save();
    })
    .then(function () {
      res.render('calendar.ical', {
        email: user.getEmail(),
        user: user.camId,
        events: infos
      });
    })
    .catch(function (e) {
      // TODO: email user and notify of error
      next(e);
    });
});

api.post('/generate-calendar', function (req, res, next) {
  if (_.isEmpty(req.body.username)) {
    let err = new Error('Must provide username.');
    err.status = 401;
    next(err);
    return;
  }

  if (_.isEmpty(req.body.password)) {
    let err = new Error('Must provide password.');
    err.status = 401;
    next(err);
    return;
  }

  var userMocker = new UserMocker();
  var user;

  userMocker.loginFromCredentials(req.body.username, req.body.password)
    .then(function () {
      return userMocker.getMealsInfo()
        .then(function (infos) {
          return User.findOne({ _camId: req.body.username });
        })
        .then(function (u) {
          if (!u) {
            u = new User({
              camId: req.body.username
            });
          }

          user = u;
          user.cookies = userMocker.getCookies();

          return user.save();
        })
        .then(function () {
          res.json({ url: 'webcal://' + req.get('host') + req.baseUrl + '/calendar/' + user.slug });
        })
        .catch(function (err) {
          next(new Error('Something went wrong'));
        });
    }, function () {
      var err = new Error('Incorrect login details.');
      err.status = 401;
      next(err);
    });
});

api.use(function (req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

api.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: err.message || 'An error occurred'
  });
});

module.exports = api;
