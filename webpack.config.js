const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: {
    main: './assets/scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build/static'),
    publicPath: '/static/',
    filename: '[name]-[chunkhash].js'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets/fonts/*.woff2',
          to: 'fonts/',
          flatten: true,
        }, {
          from: 'assets/images/*',
          to: 'img/',
          flatten: true,
        }, {
          from: 'www/*',
          to: path.resolve(__dirname, 'build/'),
          flatten: true,
        },
      ],
    }),
    new ManifestPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/\.(?:json|txt)$/],
      runtimeCaching: [{
        urlPattern: /\.html$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'html',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      }],
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  }
};
