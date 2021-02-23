const { SevereServiceError } = require('webdriverio');
const { Logger } = require('@cerner/terra-cli');
const ExpressServer = require('../express-server');
const WebpackServer = require('../webpack-server');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio-asset-server-service]' });

class AssetServerService {
  constructor(options = {}, _capabilities, config = {}) {
    const { launcherOptions } = config;
    const {
      assetServerPort,
      locale,
      site,
      theme,
    } = launcherOptions || {};

    /**
     * Always use the launcher options from the test runner if available before using
     * the options passed thru the service in wdio.conf.js. The reason is because the
     * service options set using env is cached and are unreliable if these options
     * are changed dynamically by the test runner.
     *
     * Reference: https://github.com/webdriverio/webdriverio/issues/6411
     */
    this.options = {
      ...(assetServerPort || options.port) && { port: assetServerPort || options.port },
      ...(locale || options.locale) && { locale: locale || options.locale },
      ...(site || options.site) && { site: site || options.site },
      ...(theme || options.theme) && { theme: theme || options.theme },
      ...options.webpackConfig && { webpackConfig: options.webpackConfig },
    };
  }

  /**
   * Prepares the asset server service.
   */
  async onPrepare() {
    const { webpackConfig, site } = this.options;

    if (!webpackConfig && !site) {
      logger.warn('No webpack configuration provided.');

      return;
    }

    try {
      if (site) {
        this.server = new ExpressServer(this.options);
      } else {
        this.server = new WebpackServer(this.options);
      }

      await this.server.start();
    } catch (error) {
      throw new SevereServiceError(error);
    }
  }

  /**
   * Cleans up the service.
   */
  async onComplete() {
    if (this.server) {
      await this.server.stop();

      this.server = null;
    }
  }
}

module.exports = AssetServerService;
