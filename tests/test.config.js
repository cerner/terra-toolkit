// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

const path = require('path');
const Autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = __dirname.split('tests')[0];

module.exports = {
  entry: {
    'babel-polyfill': 'babel-polyfill', // eslint-disable-next-line quote-props,
    'index': path.join(__dirname, 'nightwatch', 'fixtures', 'index'),
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  Autoprefixer({
                    browsers: [
                      'ie >= 10',
                      'last 2 versions',
                      'last 2 android versions',
                      'last 2 and_chr versions',
                      'iOS >= 8',
                    ],
                  }),
                ];
              },
            },
          }, {
            loader: 'sass-loader',
          }],
        }),
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new HtmlWebpackPlugin({
      chunks: ['babel-polyfill'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'nightwatch', 'fixtures', 'index.html'),
      chunks: ['index'],
    }),
    new webpack.NamedChunksPlugin(),
  ],
  resolve: {
    // See https://github.com/facebook/react/issues/8026
    extensions: ['.js', '.jsx'],
    alias: {
      moment: path.resolve(baseDir, 'node_modules', 'moment'),
      react: path.resolve(baseDir, 'node_modules', 'react'),
      'react-intl': path.resolve(baseDir, 'node_modules', 'react-intl'),
      'react-dom': path.resolve(baseDir, 'node_modules', 'react-dom'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(baseDir, 'dist'),
  },
  devtool: 'cheap-source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false, // eslint-disable-next-line import/no-extraneous-dependencies
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  resolveLoader: {
    modules: [path.resolve(path.join(baseDir, 'node_modules'))],
  },
};
