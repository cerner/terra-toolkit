import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

export default class WebDevServerService {
  async onPrepare(config) {
    if (!config.webpackConfig) {
      return;
    }

    this.webpackConfig = config.webpackConfig;
    this.port = config.webpackPort || 8080;
    this.webpackDevServerConfig = config.webpackDevServerConfig || { quiet: true, hot: false, inline: false };

    if (!this.webpackServer) {
      await this.startWebpackDevServer();
    }
  }

  async onComplete() {
    await this.stop();
  }

  // eslint-disable-next-line class-methods-use-this
  startWebpackDevServer() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-console
      console.log('[WebDevService] Starting WebpackDevServer');

      this.compiler = webpack(this.webpackConfig);

      this.compiler.plugin('done', () => {
        // eslint-disable-next-line no-console
        console.log('[WebDevService] Webpack compiled successfully');
        resolve();
      });

      this.compiler.plugin('invlaid', () => {
        // eslint-disable-next-line no-console
        console.log('[WebDevService] Webpack compiled unsuccessfully');
        reject();
      });

      this.webpackServer = new WebpackDevServer(this.compiler, this.webpackDevServerConfig);

      this.webpackServer.listen(this.port, '0.0.0.0', (error) => {
        if (error) {
          reject(error);
        }
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('[WebDevService] Closing WebpackDevServer');
      if (this.webpackServer) {
        this.webpackServer.close(() => {
          this.webpackServer = null;
        });
      }
      resolve();
    });
  }
}
