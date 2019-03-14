const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const ip = require('ip');
const Logger = require('../utils/logger');

const displayServer = (localAddress, networkAddress) => {
  Logger.log('Server started listening at', { context: '[Terra-Toolkit:serve]' });
  Logger.log(`* Local:            ${Logger.emphasis(localAddress)}`);
  Logger.log(`* On your network:  ${Logger.emphasis(networkAddress)}`);
};

// Create a webpack dev server instance.
const server = (options) => {
  const { port, host } = options;
  let config = options.config;
  // if config is a function, execute it with prod mode if applicable.
  if (typeof config === 'function') {
    config = config(undefined, { p: options.production });
  }

  // pull the dev server options out of the webpack config. override host, port, and stats. SRY.
  const devServerOptions = Object.assign({}, config.devServer, {
    host,
    port,
    stats: {
      colors: true,
      children: false,
    },
  });

  // Muck with entries for hot reloading
  WebpackDevServer.addDevServerEntrypoints(config, devServerOptions);
  // Make localhost hot reload if 0.0.0.0 is specified.
  if (host === '0.0.0.0') {
    WebpackDevServer.addDevServerEntrypoints(config, Object.assign({}, config.devServer, { host: 'localhost' }));
  }

  // get a compiler
  const compiler = webpack(config);
  // get a server
  const devServer = new WebpackDevServer(compiler, devServerOptions);

  // start that server.
  devServer.listen(port, host, () => {
    const localAddress = `http://${host}:${port}/`;
    const networkAddress = `http://${ip.address()}:${port}/`;
    displayServer(localAddress, networkAddress);
  });
};

module.exports = server;
