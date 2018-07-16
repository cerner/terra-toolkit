const serve = require('webpack-serve');

const webpackServe = (options) => {
  const { port, host } = options;
  let config = options.config;
  if (typeof config === 'function') {
    config = config(undefined, { p: options.production });
  }

  const serveConfig = {
    config,
    ...(port) && { port },
    ...(host) && { host || '0.0.0.0' },
    dev: {
      stats: {
        colors: true,
        children: false,
      },
    },
  };

  serve(serveConfig);
};

module.exports = webpackServe;
