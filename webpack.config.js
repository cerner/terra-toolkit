const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
  const { defaultLocale = 'en' } = env;

  return {
    entry: {
      index: path.join(__dirname, 'index'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'packages', 'terra-functional-testing', 'tests', 'fixtures', 'accessible.html'),
        chunks: ['index'],
        filename: 'accessible.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'packages', 'terra-functional-testing', 'tests', 'fixtures', 'insufficient-color-contrast.html'),
        chunks: ['index'],
        filename: 'insufficient-color-contrast.html',
      }),
    ],
    output: {
      path: path.join(process.cwd(), 'build'),
    },
    devServer: {
      publicPath: '/',
    },
    mode: 'production',
  };
};
