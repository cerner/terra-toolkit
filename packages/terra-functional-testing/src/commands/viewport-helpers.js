const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const { TERRA_VIEWPORTS } = require('../static-assets/viewports');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio-terra-service]' });

/**
 * Convenience method for getting the Terra test viewports by name.
 *
 * @param {string|string[]} sizes - the list of Terra viewport names.
 * @return {object} - Terra viewport sizes.
 */
const getViewports = (...sizes) => {
  let viewportSizes = Object.keys(TERRA_VIEWPORTS);
  if (sizes.length) {
    viewportSizes = sizes;
  }
  return viewportSizes.map(viewport => TERRA_VIEWPORTS[viewport]);
};

/**
 * Sets the viewport for the test run to the Terra test viewport size.
 *
 * @param {string} [viewport=huge] - the Terra test viewport.
 */
const setViewport = (viewport = 'huge') => {
  const terraViewport = TERRA_VIEWPORTS[viewport];
  if (terraViewport !== undefined && typeof terraViewport === 'object') {
    global.browser.setWindowSize(terraViewport.width, terraViewport.height);
  } else {
    logger.error(`The ${viewport} formFactor supplied is not a viewport size supported by Terra.`);
  }
};

/**
 * Mocha `describe` block to set and loop the tests viewports to simplify writing tests.
 * If defined, the formFactor will be used if it is included in the list of test viewports.
 * Otherwise, use the list of test viewports.
 *
 * This is intended to be used as a root-level Mocha `describe`.
 *
 * @param {string} title - The `describe` block title.
 * @param {string[]} viewports - The list of Terra viewports to tests if formFactor in the service options or env is not set.
 * @param {function} - the test function to execute for each viewport.
 */
const describeViewports = (title, viewports, fn) => {
  let localViewports = viewports;

  // If formFactor is defined in the service options/env and viewports contains this form factor, run that size else don't run the tests
  const [, options = {}] = global.browser.options.services.find(([service]) => (
    typeof service === 'function' && service.name === 'TerraService'
  ));

  const { formFactor } = options;
  if (formFactor) {
    localViewports = viewports.includes(formFactor) ? [formFactor] : [];
  }

  let currentViewportSize;
  localViewports.forEach(viewport => global.describe(`[${viewport}]`, () => {
    global.beforeAll(() => {
      currentViewportSize = global.browser.getWindowSize();
      setViewport(viewport);
    });
    global.describe(title, fn);
    global.afterAll(() => global.browser.setWindowSize(currentViewportSize.width, currentViewportSize.height));
  }));
};

module.exports = {
  getViewports,
  setViewport,
  describeViewports,
};
