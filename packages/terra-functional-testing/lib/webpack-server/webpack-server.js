const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const Logger = require('../logger/logger');

const logger = new Logger({ prefix: 'webpack-server' });

class WebpackServer {
  constructor(options = {}) {
    const { host, port } = options;

    this.config = WebpackServer.config(options);
    this.host = host || '0.0.0.0';
    this.port = port || '8080';
  }

  /**
   * Retrieves the webpack configuration.
   * @param {Object} options - The configuration options.*
   * @returns {Object|func} - The webpack configuration.
   */
  static config(options) {
    const { locale, theme = 'terra-default-theme', webpackConfig } = options;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const config = require(webpackConfig);

    if (typeof config === 'function') {
      return config({ ...locale && { defaultLocale: locale }, theme }, { p: true });
    }

    return config;
  }

  /**
   * Webpack watch override.
   * @param {Object} compiler - The webpack compiler.
   * @return {func} - A watch function override.
   */
  static watch(compiler) {
    // Store off the original watch function.
    const origWatch = compiler.watch;
    // Return a new watch function
    return (watchOptions, handler) => {
      // Call the original watch function with the compiler as 'this'.
      const watcher = origWatch.call(compiler, watchOptions, handler);
      // Remove the 'watch' function from the returned watcher.
      watcher.watch = () => {
        logger.log('Hot reloading has been disabled for tests.');
      };
      return watcher;
    };
  }

  /**
   * Starts the webpack dev server.
   * @returns {Promise} - A promise that resolves when the server has started.
   */
  start() {
    logger.info('Starting the webpack dev server.');

    return new Promise((resolve, reject) => {
      const compiler = webpack(this.config);

      // Override watch to disable hot reloading.
      compiler.watch = WebpackServer.watch(compiler);

      // Add a hooks to report when webpack has completed.
      compiler.hooks.done.tap('Done', (stats) => {
        if (stats.hasErrors()) {
          logger.error('Webpack compiled with errors.');
          reject();
        } else {
          resolve();
        }
      });

      compiler.hooks.failed.tap('Failed', () => {
        logger.error('Webpack failed to compile.');
        reject();
      });

      this.server = new WebpackDevServer(compiler, {
        ...compiler.options.devServer,
        hot: false,
        inline: false,
        liveReload: false,
        host: this.host,
        port: this.port,
        index: 'index.html',
        stats: {
          colors: true,
          children: false,
        },
      });

      // Start that server.
      this.server.listen(this.port, this.host, (error) => {
        if (error) {
          reject(error);
        } else {
          logger.info(`Webpack server has started listening at ${`http://${this.host}:${this.port}/`}.`);
        }
      });
    });
  }

  /**
   * Stops the webpack dev server.
   * @returns {Promise} - A promise that resolves when the server has been stopped.
   */
  stop() {
    logger.info('Closing the webpack dev server.');

    // Resolve immediately if the server was not available.
    if (!this.server) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.server.close(() => {
        this.server = null;
        resolve();
      });
    });
  }
}

module.exports = WebpackServer;
