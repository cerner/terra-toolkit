/* global browser */

/**
 * Injects axe-core into the browser.
 */
const injectAxe = () => {
  // eslint-disable-next-line global-require
  const { source } = require('axe-core/axe.min.js');

  // Extract the axe options for the Terra service from the global browser object.
  const [, options = {}] = browser.options.services.find(([service]) => (
    typeof service === 'function' && service.name === 'TerraService'
  ));

  browser.execute(`${source}\n ${options.axe ? `axe.configure(${JSON.stringify(options.axe)})` : ''}`);
};

module.exports = injectAxe;
