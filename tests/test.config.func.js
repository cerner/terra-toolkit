const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
  const { defaultLocale = 'en' } = env;
  return {
    entry: {
      index: path.join(__dirname, 'fixtures', 'index'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'accessible.html'),
        chunks: ['index'],
        filename: './accessible.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'accessible.html'),
        chunks: ['index'],
        filename: './index.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'compare.html'),
        chunks: ['index'],
        filename: './compare.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'theme.html'),
        chunks: ['index'],
        filename: './theme.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'inaccessible-contrast.html'),
        chunks: ['index'],
        filename: './inaccessible-contrast.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'inaccessible-text.html'),
        chunks: ['index'],
        filename: './inaccessible-text.html',
      }),
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: path.join(__dirname, 'fixtures', 'i18n.html'),
        chunks: ['index'],
        filename: './i18n.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'fixtures', '404.html'),
        inject: false,
        filename: './404.html',
      }),
    ],
    output: {
      path: path.join(process.cwd(), 'build'),
    },
    devServer: {
      host: '0.0.0.0',
      publicPath: '/',
      stats: {
        colors: true,
        children: false,
      },
    },
    mode: 'production',
  };
};
