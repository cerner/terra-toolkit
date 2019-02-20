const path = require('path');

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
  enabled: true,
  /* Retry count to test for selenium being up. */
  retries: 4000,
  /* The retry interval (in milliseconds) to wait between retries.
   */
  retryInterval: 10,
  /* Docker compose file reference when deploying the docker selenium hub stack. */
  composeFile: path.join(__dirname, '..', 'docker', 'local-docker-compose.yml'),
};

module.exports = {
  serveStatic,
  seleniumDocker,
};
