/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const mime = require('mime-types');

const compile = (webpackConfig, vfs, serviceName) => (
  new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    // setup a virtual file system to write webpack files to.
    if (vfs) {
      compiler.outputFileSystem = new MemoryFS();
    }
    console.log(`[${serviceName}] Webpack compilation started`);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(`[${serviceName}] Webpack compiled unsuccessfully`);
        reject(err || new Error(stats.toJson().errors));
      }
      console.log(`[${serviceName}] Webpack compiled successfully`);
      resolve([webpackConfig.output.path, compiler.outputFileSystem]);
    });
  })
);

const generateSite = (site, config, vfs, serviceName, production) => {
  if (site) {
    const sitePath = path.join(process.cwd(), site);
    return Promise.resolve([sitePath, undefined]);
  }

  if (config) {
    let webpackConfig = config;
    if (typeof config === 'function') {
      webpackConfig = config(undefined, { p: production });
    }

    return compile(webpackConfig, vfs, serviceName);
  }

  return Promise.reject(new Error('No config provided.'));
};

const virtualApp = (site, index, fs) => {
  const app = express();

  // Setup a catch all route, we can't use 'static' because we need to use a virtual file system
  app.get('*', (req, res, next) => {
    let filename = req.url;
    // Setup a default index for the server.
    if (filename === '/') {
      filename = `/${index}`;
    }

    const filepath = `${site}${filename}`;

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

  return Promise.resolve(app);
};

const staticApp = (site) => {
  const app = express();
  app.use(express.static(site));
  return Promise.resolve(app);
};

const serveSite = (site, fs, vfs, index) => {
  if (vfs) {
    return virtualApp(site, index, fs);
  }

  return staticApp(site);
};

const serve = (options) => {
  const { site, config, port, vfs, index, name, production } = options;
  const appPort = port || 8080;
  const appIndex = index || 'index.html';
  const serviceName = name || 'Terra-Toolkit:serve-static';

  return generateSite(site, config, vfs, serviceName, production).then(
    ([sitePath, fs]) => serveSite(sitePath, fs, vfs, appIndex)).then(
    (app) => {
      const server = app.listen(appPort);
      console.log(`[${serviceName}] Server started listening at port:${appPort}`);
      return server;
    });
};

module.exports = serve;
