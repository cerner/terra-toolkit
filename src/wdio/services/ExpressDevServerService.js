import express from 'express';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import mime from 'mime-types';
import path from 'path';

export default class ExpressDevServerService {
  async onPrepare(config) {
    if (!config.webpackConfig) {
      // eslint-disable-next-line no-console
      console.log('[ExpresDevService] No webpack configuration provided');
      return;
    }

    const webpackConfig = config.webpackConfig;
    const port = ((config || {}).expressDevServer || {}).port || 8080;
    const index = ((config || {}).expressDevServer || {}).index || 'index.html';

    await ExpressDevServerService.startExpressDevServer(webpackConfig, port, index).then((server) => {
      this.server = server;
    });
  }

  async onComplete() {
    await this.stop();
  }

  static startExpressDevServer(webpackConfig, port, index) {
    return ExpressDevServerService.compile(webpackConfig).then((fs) => {
      const app = express();

      // Setup a catch all route, we can't use 'static' because we need to use a virtual file system
      app.get('*', (req, res, next) => {
        let filename = req.url;
        // Setup a default index for the server.
        if (filename === '/') {
          filename = `/${index}`;
        }

        const filepath = `${webpackConfig.output.path}${filename}`;

        if (fs.existsSync(filepath)) {
          res.setHeader('content-type', mime.contentType(path.extname(filename)));
          res.send(fs.readFileSync(filepath));
        } else if (filename === '/favicon.ico') {
          res.sendStatus(200);
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
      console.log('[ExpresDevService] Express server started');

      return server;
    });
  }

  static compile(webpackConfig) {
    return new Promise((resolve, reject) => {
      const compiler = webpack(webpackConfig);
      // setup a virtual file system to write webpack files to.
      compiler.outputFileSystem = new MemoryFS();
      // eslint-disable-next-line no-console
      console.log('[ExpresDevService] Webpack compilation started');
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          // eslint-disable-next-line no-console
          console.log('[ExpresDevService] Webpack compiled unsuccessfully');
          reject(err || new Error(stats.toJson().errors));
        }
        // eslint-disable-next-line no-console
        console.log('[ExpresDevService] Webpack compiled successfully');
        resolve(compiler.outputFileSystem);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-console
      console.log('[ExpresDevService] Closing WebpackDevServer');
      if (this.server) {
        this.server.close();
        this.server = null;
      }
      resolve();
    });
  }
}
