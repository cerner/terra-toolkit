const ExpressServer = require('../express-server/express-server');
const WebpackServer = require('../webpack-server/webpack-server');
const Logger = require('../logger/logger');

const logger = new Logger({ prefix: 'wdio-asset-service' });

class AssetService {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Prepares the asset service.
   */
  async onPrepare() {
    const { config, site } = this.options;

    if (!config && !site) {
      logger.warn('No webpack configuration provided.');

      return;
    }

    if (site) {
      this.server = new ExpressServer(this.options);
    } else {
      this.server = new WebpackServer(this.options);
    }

    await this.server.start();
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

module.exports = AssetService;
