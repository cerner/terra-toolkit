const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'fixtures', 'index'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'test.html'),
      chunks: ['index'],
      filename: './test.html',
    }),
  ],
  output: {
    path: path.join(process.cwd(), 'build'),
  },
  mode: 'production',
};
