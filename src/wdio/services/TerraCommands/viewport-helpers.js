import SERVICE_DEFAULTS from '../../../../config/wdio/services.default-config';
import Logger from '../../../../scripts/utils/logger';

const { terraViewports: VIEWPORTS } = SERVICE_DEFAULTS;

/**
* Convenience method for getting viewports by name.
* @param sizes - [String] of viewport sizes.
* @return [Object] of viewport sizes.
*/
const getViewports = (...sizes) => {
  let viewportSizes = Object.keys(VIEWPORTS);
  if (sizes.length) {
    viewportSizes = sizes;
  }
  return viewportSizes.map(size => VIEWPORTS[size]);
};

/**
* Sets the viewport for the test run if the formFactor config is defined.
* @param formFactor - [String] the viewport size.
*/
const setViewport = (formFactor) => {
  if (formFactor) {
    const terraViewport = VIEWPORTS[formFactor];
    if (terraViewport !== undefined && typeof terraViewport === 'object') {
      global.browser.setViewportSize(terraViewport);
    } else {
      throw Logger.error('The formFactor supplied is not a Terra-defined viewport size.', { context: '[Terra-Toolkit:terra-service]' });
    }
  }
};
// name, viewports, tests
const describeViewports = (title, viewports, fn) => {
  // 1. global.options.formFactor  = 'huge' // or defined by Ci
  // 2. use defined test viewports locally
  // 3. fallback to all viewports if not
  let localViewports = viewports;

  const { formFactor } = global.browser.options;
  // if formFactor is defined and viewports contains form factor, run that size or nothing at all.
  if (formFactor) {
    localViewports = viewports.includes(formFactor) ? [formFactor] : [];
  }

  localViewports.forEach(viewport => global.describe(`[${viewport}]`, () => {
    global.before(() => setViewport(viewport));
    global.describe(title, fn);
  }));
};

const methods = {
  getViewports,
  setViewport,
  describeViewports,
};

export default methods;
