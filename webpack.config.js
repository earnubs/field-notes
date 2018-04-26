const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './assets/scripts/index.js',
    pwa: './assets/scripts/pwa.js'
  },
  output: {
    path: path.resolve(__dirname, 'build/static/js'),
    filename: '[name]-[chunkhash].js'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin(),
  ],
};
