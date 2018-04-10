// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpackConfig = require('./webpack.config');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');

const mergedConfig = merge(webpackConfig, {
  output: {
    path: path.resolve('build'),
    filename: '[name]-[hash].js',
  },
  mode: 'production',
  devtool: undefined,
  plugins: [new CleanPlugin('build', { exclude: ['stats.json'] })],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
    ],
  },
});

// Clean build before running
webpackConfig.plugins.push(new CleanPlugin('build', { exclude: ['stats.json'] }));

// Create output file
webpackConfig.output = {
  path: path.resolve('build'),
  filename: '[name]-[hash].js',
};
webpackConfig.mode = 'production';
webpackConfig.devtool = undefined;

webpackConfig.optimization = {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true, // set to true if you want JS source maps
    }),
  ],
};

console.log('config', webpackConfig);
console.log('mergedConfig', mergedConfig);


module.exports = webpackConfig;
