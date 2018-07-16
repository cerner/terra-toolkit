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
  enabled: true,
  /* Retry count to test for selenium being up. */
  retries: 4000,
  /* The retry interval (in milliseconds) to wait between retries.
   */
  retryInterval: 10,
  /* Docker compose file reference when deploying the docker selenium hub stack. */
  composeFile: path.join(__dirname, '..', 'docker', 'local-docker-compose.yml'),
};

/* Terra defined viewport sizes. */
const terraViewports = {
  tiny: { width: 470, height: 768, name: 'tiny' },
  small: { width: 622, height: 768, name: 'small' },
  medium: { width: 838, height: 768, name: 'medium' },
  large: { width: 1000, height: 768, name: 'large' },
  huge: { width: 1300, height: 768, name: 'huge' },
  enormous: { width: 1500, height: 768, name: 'enormous' },
};

module.exports = {
  axe,
  serveStatic,
  seleniumDocker,
  terraViewports,
};
