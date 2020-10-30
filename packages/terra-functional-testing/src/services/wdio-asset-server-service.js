const { SevereServiceError } = require('webdriverio');
const { Logger } = require('@cerner/terra-cli');
const ExpressServer = require('../express-server');
const WebpackServer = require('../webpack-server');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio-asset-server-service]' });

class AssetServerService {
  constructor(options = {}) {
    this.options = options;
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
