/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const mime = require('mime-types');

// Run webpack on the provided webpack config and save to either the virtual file system or disk.
const compile = (webpackConfig, disk) => (
  new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    // setup a virtual file system to write webpack files to.
    if (!disk) {
      compiler.outputFileSystem = new MemoryFS();
    }
    console.log('[Terra-Toolkit:serve-static] Webpack compilation started');
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log('[Terra-Toolkit:serve-static] Webpack compiled unsuccessfully');
        reject(err || new Error(stats.toJson().errors));
      } else {
        console.log('[Terra-Toolkit:serve-static] Webpack compiled successfully');
        resolve([webpackConfig.output.path, compiler.outputFileSystem]);
      }
    });
  })
);

// Either build the site or return the path to the provided site.
const generateSite = (site, config, disk, production) => {
  if (site) {
    const sitePath = path.join(process.cwd(), site);
    return Promise.resolve([sitePath, undefined]);
  }

  if (config) {
    let webpackConfig = config;
    if (typeof webpackConfig === 'function') {
      webpackConfig = webpackConfig(undefined, { p: production });
    }

    return compile(webpackConfig, disk);
  }

  return Promise.reject(new Error('[Terra-Toolkit:serve-static] No webpack configuration provided.'));
};

// Setup an app server that reads from a filesystem.
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

// Setup a static express server
const staticApp = (site) => {
  const app = express();
  app.use(express.static(site));
  return Promise.resolve(app);
};

// Setup an app for either a virtual site or a static site. If a file system is not provided, serve the static site.
const serveSite = (site, fs, index) => {
  if (fs) {
    return virtualApp(site, index, fs);
  }

  return staticApp(site);
};

// Generate a site if not provided and spin up an express server to serve the site.
const serve = (options) => {
  const { site, config, port, disk, index, production } = options;
  const appPort = port || 8080;
  const appIndex = index || 'index.html';

  return generateSite(site, config, disk, production).then(
    ([sitePath, fs]) => serveSite(sitePath, fs, appIndex)).then(
    (app) => {
      const server = app.listen(appPort);
      console.log(`[Terra-Toolkit:serve-static] Server started listening at port:${appPort}`);
      return server;
    });
};

module.exports = serve;
