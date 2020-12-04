const { TERRA_VIEWPORTS } = require('../../constants');

const ALL_VIEWPORTS = Object.keys(TERRA_VIEWPORTS);

/**
 * Returns an array of viewport dimensions.
 * Each supported viewport has a width, height, and name.
 * @param {string|string[]} sizes - A list of Terra viewport sizes.
 * @return {array} - An array of viewports. Returns all viewports if sizes are not provided.
 */
const getViewports = (...sizes) => {
  const viewports = sizes.length > 0 ? sizes : ALL_VIEWPORTS;

  return viewports.map((name) => TERRA_VIEWPORTS[name]);
};

module.exports = getViewports;
