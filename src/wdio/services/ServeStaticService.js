import serveStatic from '../../../scripts/serve/serve-static';
import SERVICE_DEFAULTS from '../../../config/wdio/services.default-config';
import Logger from '../../../scripts/utils/logger';

const { serveStatic: SERVE_STATIC_DEFAULTS } = SERVICE_DEFAULTS;
const context = '[Terra-Toolkit:serve-static-service]';

export default class ServeStaticService {
  async onPrepare(config = {}) {
    const site = config.site;
    const webpackConfig = config.webpackConfig;

    if (!webpackConfig && !site) {
      Logger.warn('No webpack configuration provided', { context });
      return;
    }

    const verbose = config.logLevel !== 'silent';
    const port = (config.serveStatic || {}).port || SERVE_STATIC_DEFAULTS.port;
    const index = (config.serveStatic || {}).index || SERVE_STATIC_DEFAULTS.index;
    // Explicitly not providing a fallback locale. Providing a fallback will lock the locale for all test runs when using the tt-wdio-runner.
    const locale = (config || {}).locale;

    // Ensure the server was properly shut down.
    if (this.server) {
      await this.stop();
    }

    const serveOptions = {
      ...site && { site, disk: true },
      config: webpackConfig,
      port,
      index,
      locale,
      verbose,
    };

    await ServeStaticService.startService(serveOptions).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  // Options include config, site, port, index, locale, verbose
  static startService(serveOptions) {
    return serveStatic({
      ...serveOptions, production: true,
    });
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
