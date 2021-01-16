/* global browser */

const { TERRA_VIEWPORTS } = require('../../../constants');

/**
 * Determines the current viewport size.
 *
 * @returns {Object} - the current viewport size.
 */
function getViewportSize() {
  const res = browser.execute(() => (
    {
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    }
  ));

  return {
    width: res.screenWidth,
    height: res.screenHeight,
  };
}

/**
 * Determines the Terra form factor for the current viewport size.
 *
 * @param {Number} viewpointWidth - Current width of the viewpoint.
 * @returns {String} - Terra form factor the current viewport falls under.
 */
function getTerraFormFactor(viewpointWidth) {
  const viewports = Object.entries(TERRA_VIEWPORTS);
  const currentWidth = viewpointWidth && viewpointWidth > 0 ? viewpointWidth : getViewportSize().width;

  for (let index = 0; index < viewports.length; index += 1) {
    const [formFactor, size] = viewports[index];

    if (currentWidth <= size.width) {
      return formFactor;
    }
  }

  return 'huge';
}

module.exports = getTerraFormFactor;
