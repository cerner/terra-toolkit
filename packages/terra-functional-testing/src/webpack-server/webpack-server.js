const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const { Logger } = require('@cerner/terra-cli');
const { SevereServiceError } = require('webdriverio');
const http = require('http');

const logger = new Logger({ prefix: '[terra-functional-testing:webpack-server]' });

class WebpackServer {
  constructor(options = {}) {
    const { host, port } = options;

    this.config = WebpackServer.config(options);
    this.host = host || '0.0.0.0';
    this.port = port || '8080';
    this.gridUrl = options.gridUrl ? `http://${options.gridUrl}:80/status` : undefined;
  }

  /**
   * Retrieves the webpack configuration.
   * @param {Object} options - The configuration options.*
   * @returns {Object|func} - The webpack configuration.
   */
  static config(options) {
    const { locale, overrideTheme, webpackConfig } = options;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const config = require(webpackConfig);

    if (typeof config === 'function') {
      return config({
        ...locale && { defaultLocale: locale },
        ...overrideTheme && { defaultTheme: overrideTheme },
      },
      { p: true });
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
        logger.info('Hot reloading has been disabled for tests.');
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
        } else if (!this.gridUrl) {
          resolve();
        } else {
          let response = '';
          http.get(this.gridUrl, (res) => {
            const { statusCode } = res;
            if (statusCode >= 200 && statusCode <= 299) {
              res.on('data', (chunk) => {
                response += chunk;
              });
              res.on('end', () => {
                if (!res.complete) throw new SevereServiceError(`${this.gridUrl} connection was terminated while the message was still being sent`);
                if (JSON.parse(response).value.ready) {
                  resolve();
                } else {
                  throw new SevereServiceError(`${this.gridUrl} failed to return a ready response. Check to ensure the selenium grid is stable`);
                }
              });
            } else {
              throw new SevereServiceError(`Url ${this.gridUrl} returns status code of ${statusCode}.`);
            }
          }).on('error', (e) => {
            throw new SevereServiceError(`Failed to connect to url ${this.gridUrl}. Error thrown: ${e.message}`);
          });
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
