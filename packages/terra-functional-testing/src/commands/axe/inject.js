/* global browser */

/**
 * Injects axe-core into the browser.
 * @param {Object} options - The axe configuration options.
 */
const injectAxe = async (options) => {
  // eslint-disable-next-line global-require
  const { source } = require('axe-core/axe.min');

  // TODO: Figure out why this function no longer works indirectly after removing @wdio/sync
  await browser.execute(`${source}\n ${options ? `axe.configure(${JSON.stringify(options)})` : ''}`);
};

module.exports = injectAxe;
