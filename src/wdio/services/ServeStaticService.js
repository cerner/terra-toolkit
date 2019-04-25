import serveStatic from '../../../scripts/serve/serve-static';
import SERVICE_DEFAULTS from '../../../config/wdio/services.default-config';
import Logger from '../../../scripts/utils/logger';

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const { serveStatic: SERVE_STATIC_DEFAULTS } = SERVICE_DEFAULTS;
const context = '[Terra-Toolkit:serve-static-service]';

const displayServer = () => {
  Logger.log('Server started listening', { context });
};

// Create a webpack dev server instance.
const startWebpackDevServer = (options) => {
  const {
    port, index, locale,
  } = options;
  const host = '0.0.0.0';
  let { config } = options;
  // if config is a function, execute it with prod mode if applicable.
  if (typeof config === 'function') {
    const env = { ...locale && { defaultLocale: locale } };
    config = config(env, { p: true });
  }

  // pull the dev server options out of the webpack config. override host, port, and stats. SRY.
  const devServerOptions = Object.assign({}, config.devServer, {
    // Disable hot reloading
    hot: false,
    inline: false,
    host,
    port,
    index,
    stats: {
      colors: true,
      children: false,
    },
  });

  // get a compiler
  const compiler = webpack(config);
  // get a server
  const devServer = new WebpackDevServer(compiler, devServerOptions);

  // start that server.
  return new Promise((resolve, reject) => {
    devServer.listen(port, host, (err) => {
      if (err) {
        reject(err);
      }
      displayServer();
      resolve(devServer);
    });
  });
};

export default class ServeStaticService {
  async onPrepare(config = {}) {
    const { site, webpackConfig, locale = process.env.LOCALE } = config;

    if (!webpackConfig && !site) {
      Logger.warn('No webpack configuration provided', { context });
      return;
    }

    const port = (config.serveStatic || {}).port || SERVE_STATIC_DEFAULTS.port;
    const index = (config.serveStatic || {}).index || SERVE_STATIC_DEFAULTS.index;
    // Explicitly not providing a fallback locale. Providing a fallback will lock the locale for all test runs when using the tt-wdio-runner.

    // Ensure the server was properly shut down.
    if (this.server) {
      await this.stop();
    }

    const serveOptions = {
      ...site && { site },
      config: webpackConfig,
      port,
      index,
      locale,
      production: true,
    };

    await ServeStaticService.startService(serveOptions).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  // Options include config, site, port, index, locale
  static startService(serveOptions) {
    if (serveOptions.site) {
      return serveStatic(serveOptions);
    }
    return startWebpackDevServer(serveOptions);
  }

  stop() {
    return new Promise((resolve) => {
      Logger.log('Closing Server', { context });
      if (this.server) {
        this.server.close();
        this.server = null;
      }
      resolve();
    });
  }
}
