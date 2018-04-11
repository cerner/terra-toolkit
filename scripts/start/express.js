/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const mime = require('mime-types');

const preBuiltSite = (site) => {
  const app = express();
  const sitePath = path.join(process.cwd(), site);
  app.use('/static', express.static(sitePath));
  app.get('/', (req, res) => res.redirect('/static'));
  return Promise.resolve(app);
};

const compile = (webpackConfig, vfs) => (
  new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    // setup a virtual file system to write webpack files to.
    if (vfs) {
      compiler.outputFileSystem = new MemoryFS();
    }
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
  })
);

const webpackSite = (config, index) => (
  compile(config, false).then((fs) => {
    const app = express();

    // Setup a catch all route, we can't use 'static' because we need to use a virtual file system
    app.get('*', (req, res, next) => {
      let filename = req.url;
      // Setup a default index for the server.
      if (filename === '/') {
        filename = `/${index}`;
      }

      const filepath = `${config.output.path}${filename}`;

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
    // eslint-disable-next-line no-console
    console.log('[ExpresDevService] Express server started');

    return app;
  })
);

const setupSite = (options) => {
  const { site, config, index } = options;

  if (site) {
    return preBuiltSite(site);
  }

  if (config) {
    return webpackSite(config, index);
  }

  return Promise.reject(new Error('No config provided.'));
};

const serve = (options) => {
  const { port } = options;
  const appPort = port || 8080;

  return setupSite(options).then((app) => {
    const server = app.listen(appPort);
    console.log(`Listening ${appPort}`);
    console.log(`Production Environment: ${process.env.NODE_ENV === 'production'}`);
    return server;
  });
};

module.exports = serve;
