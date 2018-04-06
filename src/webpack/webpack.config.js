// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack');
const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const aggregateTranslations = require('../../scripts/aggregate-translations/aggregate-translations');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const processPath = process.cwd();
/* Get the root path of a mono-repo process call */
const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

aggregateTranslations({ baseDirectory: rootPath });

/* Get the site configuration to add as a resolve path */
let devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));
const customSiteConfigPath = path.join(devSiteConfigPath, 'site.config.js');
devSiteConfigPath = isFile(customSiteConfigPath) ? devSiteConfigPath : path.join('src', 'config');

const defaultWebpackConfig = {
  entry: {
    raf: 'raf/polyfill',
    'babel-polyfill': 'babel-polyfill',
    'terra-dev-site': path.resolve(path.join(__dirname, '..', 'Index')),
  },
  module: {
    rules: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules(?!\/terra-dev-site\/src)/,
      use: 'babel-loader',
    },
    {
      test: /\.(scss|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            importLoaders: 2,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins() {
              return [
                Autoprefixer({
                  browsers: [
                    'ie >= 10',
                    'last 2 versions',
                    'last 2 android versions',
                    'last 2 and_chr versions',
                    'iOS >= 10',
                  ],
                }),
                rtl(),
              ];
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            data: '$bundled-themes: mock;',
          },
        },
      ],
    },
    {
      test: /\.md$/,
      use: 'raw-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: 'file-loader',
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Site',
      template: path.join(__dirname, '..', 'index.html'),
    }),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: false,
      plugins: [
        PostCSSCustomProperties({ preserve: true }),
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(rootPath, 'aggregated-translations'),
      devSiteConfigPath,
      'node_modules',
    ],

    // See https://github.com/facebook/react/issues/8026
    alias: {
      react: path.resolve(rootPath, 'node_modules', 'react'),
      'react-intl': path.resolve(rootPath, 'node_modules', 'react-intl'),
      'react-dom': path.resolve(rootPath, 'node_modules', 'react-dom'),
    },
  },
  output: {
    path: path.join(rootPath, 'build'),
  },
  devtool: 'cheap-module-eval-source-map',
  resolveLoader: {
    modules: [path.resolve(path.join(rootPath, 'node_modules'))],
  },
  mode: 'development',
};

module.exports = defaultWebpackConfig;
