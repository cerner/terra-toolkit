/* global browser */

/**
 * Injects axe-core into the browser.
 * @param {Object} options - The axe configuration options.
*/
const injectAxe = async () => {
  // eslint-disable-next-line global-require
  const { source } = require('axe-core/axe.min');
  await browser.execute(source);
};

module.exports = injectAxe;
