const serve = require('webpack-serve');

const webpackServe = (options) => {
  const serveConfig = { config: options.config };
  if (options.port) {
    serveConfig.port = options.port;
  }
  serve(serveConfig);
};

module.exports = webpackServe;
