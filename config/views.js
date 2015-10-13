'use strict';

var _ = require('lodash');

module.exports = function (app) {
  var nunjucks = require('nunjucks');
  var assetsFile = require('../assets/dist/webpack-assets.json');

  var env = nunjucks.configure('views', {
    autoescape: true,
    noCache: app.settings.env == 'development',
    express: app
  });

  env.addFilter('calEscape', function (text) {
    return text
      .replace(/\,\;/g, function (match) { return '\\' + match; })
      .replace(/(\r\n|\n|\r)/gm, '\\n');
  });

  env.addGlobal('asset', function (asset) {
    if (_.has(assetsFile.main, asset)) {
      asset = assetsFile.main[asset];
    }

    return '/static/' + asset;
  });

  return env;
};
