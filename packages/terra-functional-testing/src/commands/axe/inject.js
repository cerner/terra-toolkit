/* global browser */

/**
 * Injects axe-core into the browser.
 * @param {Object} options - The axe configuration options.
 */
const injectAxe = (options = {}) => {
  // eslint-disable-next-line global-require
  const { source } = require('axe-core/axe.min.js');

  const { rules } = options;

  const config = {
    ...options,
    // axe.configure has a different API than axe.run. Rules must be an array for axe.configure.
    ...rules && { rules: Object.keys(rules).map((rule) => ({ ...rules[rule], id: rule })) },
  };

  browser.execute(`${source}\n axe.configure(${JSON.stringify(config)})`);
};

module.exports = injectAxe;
