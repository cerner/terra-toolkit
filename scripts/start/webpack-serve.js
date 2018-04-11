const serve = require('webpack-serve');

const webpackServe = (options) => {
  serve({ config: options.confg });
};

module.exports = webpackServe;
