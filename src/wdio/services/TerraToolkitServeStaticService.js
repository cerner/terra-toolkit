import serve from '../../../scripts/serve/serve-static';

export default class TerraToolkitServeStaticService {
  async onPrepare(config) {
    if (!config.webpackConfig) {
      // eslint-disable-next-line no-console
      console.log('[Terra-Toolkit:serve-static] No webpack configuration provided');
      return;
    }

    const webpackConfig = config.webpackConfig;
    const port = ((config || {}).serveStatic || {}).port || 8080;
    const index = ((config || {}).serveStatic || {}).index || 'index.html';

    // If no output is provided, define one.
    if (!(webpackConfig.output || {}).path) {
      webpackConfig.output = Object.assign({}, webpackConfig.output, { path: '/dist' });
    }

    await TerraToolkitServeStaticService.startService(webpackConfig, port, index).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  static startService(config, port, index) {
    return serve({ config, port, index, vfs: true });
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
