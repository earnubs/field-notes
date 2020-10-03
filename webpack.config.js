const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const publicPath = path.resolve(__dirname, 'build/static/js/');

module.exports = {
  mode: 'production',
  entry: {
    main: './assets/scripts/index.js',
  },
  output: {
    path: publicPath,
    publicPath: '/static/js/',
    filename: '[name]-[chunkhash].js'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],
      runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 12,
          },
        },
      }],
    })
  ],
};
