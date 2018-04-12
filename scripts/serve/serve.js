const serve = require('webpack-serve');

const webpackServe = (options) => {
  let config = options.config;
  if (typeof config === 'function') {
    config = config(undefined, { p: options.production });
  }

  const serveConfig = { config };
  if (options.port) {
    serveConfig.port = options.port;
  }
  serve(serveConfig);
};

module.exports = webpackServe;
