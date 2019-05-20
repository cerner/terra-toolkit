const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'fixtures', 'index'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'nightwatch.html'),
      chunks: ['index'],
      filename: './nightwatch.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'accessible.html'),
      chunks: ['index'],
      filename: './accessible.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'accessible.html'),
      chunks: ['index'],
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'compare.html'),
      chunks: ['index'],
      filename: './compare.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'theme.html'),
      chunks: ['index'],
      filename: './theme.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'inaccessible-contrast.html'),
      chunks: ['index'],
      filename: './inaccessible-contrast.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'inaccessible-text.html'),
      chunks: ['index'],
      filename: './inaccessible-text.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'i18n.html'),
      chunks: ['index'],
      filename: './i18n.html',
    }),
  ],
  output: {
    path: path.join(process.cwd(), 'build'),
  },
  mode: 'production',
};
