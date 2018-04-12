import express from '../../../scripts/serve/serve-static';

export default class ExpressDevServerService {
  async onPrepare(config) {
    if (!config.webpackConfig) {
      // eslint-disable-next-line no-console
      console.log('[ExpressDevService] No webpack configuration provided');
      return;
    }

    const webpackConfig = config.webpackConfig;
    const port = ((config || {}).expressDevServer || {}).port || 8080;
    const index = ((config || {}).expressDevServer || {}).index || 'index.html';

    // If no output is provided, define one.
    if (!(webpackConfig.output || {}).path) {
      webpackConfig.output = Object.assign({}, webpackConfig.output, { path: '/dist' });
    }

    await ExpressDevServerService.startExpressDevServer(webpackConfig, port, index).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  static startExpressDevServer(config, port, index) {
    return express({ config, port, index, vfs: true });
  }

  stop() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('[ExpressDevService] Closing WebpackDevServer');
      if (this.server) {
        this.server.close();
        this.server = null;
      }
      resolve();
    });
  }
}
