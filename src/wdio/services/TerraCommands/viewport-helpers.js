import SERVICE_DEFAULTS from '../../../../config/wdio/services.default-config';
import Logger from '../../../../scripts/utils/logger';

const { terraViewports: VIEWPORTS } = SERVICE_DEFAULTS;

/**
* Convenience method for getting the Terra test viewports by name.
*
* @param {string|string[]} sizes - the list of Terra viewport names.
* @return {object} - Terra viewport sizes.
*/
const getViewports = (...sizes) => {
  let viewportSizes = Object.keys(VIEWPORTS);
  if (sizes.length) {
    viewportSizes = sizes;
  }
  return viewportSizes.map(size => VIEWPORTS[size]);
};

/**
* Sets the viewport for the test run to the Terra test viewport size.
*
* @param {string} [formFactor=huge] - the Terra test viewport.
*/
const setViewport = (formFactor) => {
  if (formFactor) {
    const terraViewport = VIEWPORTS[formFactor];
    if (terraViewport !== undefined && typeof terraViewport === 'object') {
      global.browser.setViewportSize(terraViewport);
    } else {
      throw Logger.error('The formFactor supplied is not a Terra-defined viewport size.', { context: '[Terra-Toolkit:terra-service]' });
    }
  } else {
    const defaultViewport = VIEWPORTS.huge;
    global.browser.setViewportSize(defaultViewport);
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
* @param {string[]} viewports - The list of Terra viewports to tests if formFactor is not set.
* @param {function} - the test function to execute for each viewport.
*/
const describeViewports = (title, viewports, fn) => {
  let localViewports = viewports;

  // If formFactor is defined and viewports contains the form factor, run that size else don't run the tests
  const { formFactor } = global.browser.options;
  if (formFactor) {
    localViewports = viewports.includes(formFactor) ? [formFactor] : [];
  }

  let currentViewportSize;
  localViewports.forEach(viewport => global.describe(`[${viewport}]`, () => {
    global.before(() => {
      currentViewportSize = global.browser.getViewportSize();
      setViewport(viewport);
    });
    global.describe(title, fn);
    global.after(() => global.browser.setViewportSize(currentViewportSize));
  }));
};

const methods = {
  getViewports,
  setViewport,
  describeViewports,
};

export default methods;
