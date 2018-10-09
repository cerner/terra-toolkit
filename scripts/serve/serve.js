// const serve = require('webpack-serve');
const WebpackDevServer = require('webpack-dev-server');
const Webpack = require('webpack');

const server = (options) => {
  const { port, host } = options;
  let config = options.config;
  if (typeof config === 'function') {
    config = config(undefined, { p: options.production });
  }

  const devServerOptions = Object.assign({}, config.devServer, {
    stats: {
      colors: true,
      children: false,
    },
  });

  // const serveConfig = {
  //   config,
  //   ...(port) && { port },
  //   ...(host) && { host },
  //   dev: {
  //     stats: {
  //       colors: true,
  //       children: false,
  //     },
  //   },
  // };

  // serve(serveConfig);

  const compiler = Webpack(config);

  const devServer = new WebpackDevServer(compiler, devServerOptions);

  devServer.listen(port, host, () => {
    console.log(`Starting server on http://${host}:${port}`);
  });
};

module.exports = server;
