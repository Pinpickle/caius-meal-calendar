var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var path = require('path');

module.exports = function (prod) {
  var dir = path.join(__dirname, '..');
  var plugins = [];

  var js = 'js/[name].js';
  var css = 'css/main.css';

  if (prod) {
    js = 'js/[name]-[hash].js';
    css = 'css/main-[hash].css';
  }

  plugins.push(new ExtractTextPlugin(css, {
    allChunks: true
  }));

  plugins.push(new AssetsPlugin({ path: path.join(dir, 'assets/dist') }));

  return {
    context: path.join(dir, '/assets'),
    entry: './scripts/main.js',
    module: {
      loaders: [
        { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer!stylus-loader?paths=node_modules') }
      ]
    },
    output: {
      path: path.join(dir, '/assets/dist'),
      filename: js
    },
    plugins: plugins
  };
}
