import serve from '../../../scripts/serve/serve-static';
import SERVICE_DEFAULTS from '../../../config/wdio/services.default-config';

const SERVE_STATIC_DEFAULTS = SERVICE_DEFAULTS.serveStatic;

export default class ServeStaticService {
  async onPrepare(config = {}) {
    const webpackConfig = config.webpackConfig;

    if (!webpackConfig) {
      // eslint-disable-next-line no-console
      console.warn('[Terra-Toolkit:serve-static] No webpack configuration provided');
      return;
    }

    const port = (config.serveStatic || {}).port || SERVE_STATIC_DEFAULTS.port;
    const index = (config.serveStatic || {}).index || SERVE_STATIC_DEFAULTS.index;
    const locale = (config || {}).locale || 'en';

    // If no output is provided, define one.
    if (!(webpackConfig.output || {}).path) {
      webpackConfig.output = Object.assign({}, webpackConfig.output, { path: '/dist' });
    }

    await ServeStaticService.startService(webpackConfig, port, index, locale).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  static startService(config, port, index, locale) {
    return serve({ config, port, index, production: true, locale });
  }

  stop() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('[Terra-Toolkit:serve-static] Closing Server');
      if (this.server) {
        this.server.close();
        this.server = null;
      }
      resolve();
    });
  }
}
