const path = require('path');
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
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'packages', 'terra-functional-testing', 'tests', 'fixtures', 'dispatch-custom-event.html'),
        chunks: ['index'],
        filename: 'dispatch-custom-event.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'packages', 'terra-functional-testing', 'tests', 'fixtures', 'validates-element.html'),
        chunks: ['index'],
        filename: 'validates-element.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'packages', 'terra-functional-testing', 'tests', 'fixtures', 'element-out-of-bound.html'),
        chunks: ['index'],
        filename: 'element-out-of-bound.html',
      }),
    ],
    output: {
      path: path.join(process.cwd(), 'build'),
    },
    devServer: {
      devMiddleware: {
        publicPath: '/',
      },
    },
    mode: 'production',
  };
};
