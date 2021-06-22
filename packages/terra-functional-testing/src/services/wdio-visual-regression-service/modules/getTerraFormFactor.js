/* global browser */

const { TERRA_VIEWPORTS } = require('../../../constants');

/**
 * Determines the current viewport size.
 *
 * @returns {Object} - the current viewport size.
 */
function getViewportSize() {
  // eslint-disable-next-line prefer-arrow-callback
  return browser.getWindowSize();
}

/**
 * Determines the Terra form factor for the current viewport size.
 *
 * @returns {String} - Terra form factor the current viewport falls under.
 */
function getTerraFormFactor() {
  const viewports = Object.entries(TERRA_VIEWPORTS);
  const currentWidth = getViewportSize().width;

  for (let index = 0; index < viewports.length; index += 1) {
    const [formFactor, size] = viewports[index];

    if (currentWidth <= size.width) {
      return formFactor;
    }
  }

  return 'enormous';
}

module.exports = getTerraFormFactor;
