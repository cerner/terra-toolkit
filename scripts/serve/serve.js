const serve = require('webpack-serve');

const webpackServe = (options) => {
  serve({ config: options.config });
};

module.exports = webpackServe;
