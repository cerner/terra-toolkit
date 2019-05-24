const express = require('express');
const ip = require('ip');

const Logger = require('../utils/logger');

const context = '[Terra-Toolkit:serve-static]';
const displayServer = (localAddress, networkAddress) => {
  Logger.log('Server started listening at', { context });
  Logger.log(`* Local:            ${Logger.emphasis(localAddress)}`);
  Logger.log(`* On your network:  ${Logger.emphasis(networkAddress)}`);
};

// Setup a static express server
const staticApp = (site, index) => {
  const app = express();
  const options = {
    ...index && { index },
    // If an extension-less file can't be found search for it with .html and .htm
    extensions: ['html', 'htm'],
  };
  // Return any files in the site. If no extension is provided check the file with the htm or html extension.
  app.use(express.static(site, options));
  // Match on *.htm, *.html or routes without extensions.
  app.use([/\/[^.]*$/, '/*.html?'], (req, res, next) => {
    // Return 404.html if provided.
    res.status(404).sendFile('/404.html', { root: site }, () => {
      // If there is an error, bail.
      next();
    });
  });

  return app;
};

// Generate a site if not provided and spin up an express server to serve the site.
const serve = (options) => {
  const {
    // Setting defaults here instead of in cli.
    site, port = 8080, host = '0.0.0.0', index,
  } = options;

  const app = staticApp(site, index);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, (err) => {
      if (err) {
        reject(err);
      }
      const localAddress = `http://${host}:${port}/`;
      const networkAddress = `http://${ip.address()}:${port}/`;
      displayServer(localAddress, networkAddress);
      resolve(server);
    });
  });
};

module.exports = serve;
