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
// // name, viewports, tests
// const describeViewports = (...args) => {
//   // 1. global.options.formFactor  = 'huge' // or defiend by Ci
//   // 2. use defined test viewports locally
//   // 2. use defined test viewports locally
//   // 3. fallback to all viewports if not 

//   const testViewports = getViewports(...viewports) || VIEWPORTS;
//   // const testViewports = global.options.formFactor || getViewports(...viewports) || VIEWPORTS;

//   testViewports.forEach(viewport => global.describe(`${name} - ${viewport.name}`, () => {
//     global.before(() => setViewport(viewport));
//     tests();
//   }));
// };

const methods = {
  getViewports,
  setViewport,
  // describeViewports,
};

export default methods;
