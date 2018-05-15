const path = require('path');

/* Axe Service Defaults */
const axe = {
  /* Wheather or not to inject axe into the browser. */
  inject: true,
  /* Axe configiuration options. */
  options: undefined,
};

/* Serve Static Service Defaults */
const serveStatic = {
  /* The port to start the express server on. */
  port: 8080,
  /* The base html template name. */
  index: 'index.html',
};

/* Selenium Docker Service Defaults */
const seleniumDocker = {
  /* Whether or not the service should be run. */
  enabled: !process.env.TRAVIS && !process.env.CI,
  /* Retry count to test for selenium being up. */
  retries: 4000,
  /* The retry interval (in milliseconds) to wait between retries.
   */
  retryInterval: 10,
  /* Docker compose file reference when deploying the docker selenium hub stack. */
  composeFile: path.join(__dirname, 'local-docker-compose.yml'),
};

module.exports = {
  axe,
  serveStatic,
  seleniumDocker,
};
