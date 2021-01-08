const { TERRA_VIEWPORTS } = require('../../../constants');
/**
 * Determines the Terra form factor to for the current viewport size.
 *
 * @param {Number} viewpointWidth - Current width of the viewpoint.
 * @returns {String} - Terra form factor the current viewport with falls under.
 */
function getTerraFormFactor(viewpointWidth) {
  const viewports = Object.entries(TERRA_VIEWPORTS);

  for (let index = 0; index < viewports.length; index += 1) {
    const [formFactor, size] = viewports[index];

    if (viewpointWidth <= size.width) {
      return formFactor;
    }
  }

  return 'enormous';
}

module.exports = getTerraFormFactor;
