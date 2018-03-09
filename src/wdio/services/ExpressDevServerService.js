import express from 'express';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import mime from 'mime-types';
import path from 'path';


export default class WebDevServerService {
  async onPrepare(config) {
    if (!config.webpackConfig) {
      // eslint-disable-next-line no-console
      console.log('[WebDevService] No webpack configuration provided');
      return;
    }

    const webpackConfig = config.webpackConfig;
    const port = config.webpackPort || 8080;

    await WebDevServerService.startExpressDevServer(webpackConfig, port).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  static startExpressDevServer(webpackConfig, port) {
    return WebDevServerService.compile(webpackConfig).then((fs) => {
      const app = express();

      // Setup a catch all route, we can't use 'static' because we need to use a vfs
      app.get('*', (req, res, next) => {
        let filename = req.url;
        // Setup a default to route / to the index.html file.
        // Should this be configurable in the future?
        if (filename === '/') {
          filename = '/index.html';
        }

        const filepath = `${webpackConfig.output.path}${filename}`;

        if (fs.existsSync(filepath)) {
          res.setHeader('content-type', mime.contentType(path.extname(filename)));
          res.send(fs.readFileSync(filepath));
        } else {
          next();
        }
      });

      app.use((req, res, next) => {
        const err = new Error(`Not Found: ${req.originalUrl}`);
        err.status = 404;
        next(err);
      });

      // error handler
      app.use((err, req, res) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = err;

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      });

      const server = app.listen(port);
      // eslint-disable-next-line no-console
      console.log('[WebDevService] Express server started');

      return server;
    });
  }

  static compile(webpackConfig) {
    return new Promise((resolve, reject) => {
      const compiler = webpack(webpackConfig);
      // setup a virtual file system to write webpack files to.
      compiler.outputFileSystem = new MemoryFS();
      // eslint-disable-next-line no-console
      console.log('[WebDevService] Webpack compilation started');
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          // console.log(err);
          // console.log(stats);
          // eslint-disable-next-line no-console
          console.log('[WebDevService] Webpack compiled unsuccessfully');
          reject();
        }
        // eslint-disable-next-line no-console
        console.log('[WebDevService] Webpack compiled successfully');
        resolve(compiler.outputFileSystem);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('[WebDevService] Closing WebpackDevServer');
      if (this.server) {
        this.server.close();
        this.server = null;
      }
      resolve();
    });
  }
}
