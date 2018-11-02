/* eslint-disable no-console */
const express = require('express');
const fse = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const clone = require('clone');
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
    console.log('[Terra-Toolkit:serve-static] Starting Webpack compilation');
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(`[Terra-Toolkit:serve-static] Webpack failed to compile in ${webpackConfig.mode} mode`);
        reject(err || new Error(stats.toJson().errors));
      } else {
        if (stats.hasWarnings()) {
          console.warn(stats.toJson().warnings);
        }
        console.log(`[Terra-Toolkit:serve-static] Webpack compiled successfully in ${webpackConfig.mode} mode`);
        resolve([webpackConfig.output.path, compiler.outputFileSystem]);
      }
    });
  })
);

// Either build the site or return the path to the provided site.
const generateSite = (site, config, disk, production) => {
  if (site) {
    const sitePath = path.join(process.cwd(), site);

    if (fse.existsSync(sitePath) && fse.lstatSync(sitePath).isDirectory()) {
      const fileSystem = disk ? fse : undefined;
      return Promise.resolve([sitePath, fileSystem]);
    }

    return Promise.reject(new Error(`[Terra-Toolkit:serve-static] Could not serve static site from ${sitePath}.`));
  }

  if (config) {
    let webpackConfig;
    if (typeof config === 'function') {
      webpackConfig = config(undefined, { p: production });
    } else {
      webpackConfig = clone(config);
    }

    if (!(webpackConfig.output || {}).path) {
      webpackConfig.output = Object.assign({}, webpackConfig.output, { path: '/dist' });
    }

    return compile(webpackConfig, disk);
  }

  return Promise.reject(new Error('[Terra-Toolkit:serve-static] No webpack configuration provided.'));
};

// Set the test locale for the html file
const setSiteLocale = (fileContent, locale) => {
  const localeComment = `<!-- Terra-toolkit's serve-static set the default site locale to ${locale}.-->`;
  const content = fileContent.replace(/<html/, `${localeComment}\n<html`);

  const langPattern = /lang="[a-zA-Z0-9-]*"/;
  const langLocale = `lang="${locale}"`;

  const isLanguageSet = content.match(langPattern);
  if (isLanguageSet) {
    return content.replace(langPattern, langLocale);
  }

  return content.replace(/<html/, `<html ${langLocale}`);
};

// Setup an app server that reads from a filesystem.
const virtualApp = (site, index, locale, fs, verbose) => {
  const app = express();

  // Setup a catch all route, we can't use 'static' because we need to use a virtual file system
  app.get('*', (req, res, next) => {
    let filename = req.url;
    // Setup a default index for the server.
    if (filename === '/') {
      filename = `/${index}`;
    }

    // Filter query params
    const filepath = `${site}${filename}`.replace(/(\?).*/, '');

    if (fs.existsSync(filepath)) {
      if (filename === '/favicon.ico') {
        res.sendStatus(200);
        return;
      }

      const fileExt = path.extname(filename).replace(/(\?).*/, '');
      res.setHeader('content-type', mime.contentType(fileExt));

      if (fileExt === '.html') {
        let fileContent = fs.readFileSync(filepath, 'utf8');
        fileContent = setSiteLocale(fileContent, locale);
        res.send(fileContent);
      } else {
        res.send(fs.readFileSync(filepath));
      }
    } else {
      next();
    }
  });

  if (verbose) {
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
  }

  return Promise.resolve(app);
};

// Setup a static express server
const staticApp = (site) => {
  const app = express();
  app.use(express.static(site));
  return Promise.resolve(app);
};

// Setup an app for either a virtual site or a static site. If a file system is not provided, serve the static site.
const serveSite = (site, fs, index, locale, verbose) => {
  if (fs) {
    return virtualApp(site, index, locale, fs, verbose);
  }

  return staticApp(site);
};

// Generate a site if not provided and spin up an express server to serve the site.
const serve = (options) => {
  const {
    site, config, port, disk, index, locale, production, host, verbose,
  } = options;

  const appPort = port || 8080;
  const appIndex = index || 'index.html';
  const appLocale = locale || process.env.LOCALE || 'en';

  return generateSite(site, config, disk, production)
    .then(([sitePath, fs]) => serveSite(sitePath, fs, appIndex, appLocale, verbose))
    .then((app) => {
      const server = app.listen(appPort, host);
      console.log(`[Terra-Toolkit:serve-static] Server started listening at port:${appPort}`);
      return server;
    });
};

module.exports = serve;
