'use strict';

var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');

module.exports = function (app) {
  app.locals.mailer = nodemailer.createTransport(mandrillTransport({
    auth: {
      apiKey: process.env.MANDRILL_KEY
    }
  }));
};
