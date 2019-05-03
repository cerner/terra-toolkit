const determineArgs = (...args) => {
  const param1 = args.length ? args[0] : undefined;
  const param2 = args.length > 1 ? args[1] : undefined;

  let name = 'default';
  let options = {};
  if (typeof param1 === 'string') {
    name = param1;
    options = typeof param2 === 'object' && !Array.isArray(param2) ? param2 : options;
  } else {
    options = typeof param1 === 'object' && !Array.isArray(param1) ? param1 : options;
  }

  // Check if custom selector should be used, otherwise use the global value.
  const selector = options.selector || global.browser.options.terra.selector;

  return {
    name,
    options,
    selector,
  };
};

/**
* Helper method to determine the selector and axe rules for the test run.
* @param {Array} args - The list of test arguments to parse.
*/
const determineAxeOptions = (args) => {
  const { options, selector } = determineArgs(...args);

  return {
    ...options.axeRules && { rules: options.axeRules },
    restoreScroll: true,
    context: selector,
  };
};

/**
* Helper method to determine the screenshot tag name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods. Currently supported VR comparision
* options are:
*     - viewports: [{ width: Number, height: Number }]
*     - misMatchTolerance: Number
*     - viewportChangePause: Number
* @param {Array} args - The list of test arguments to parse.
*/
const determineScreenshotOptions = (args) => {
  const { name, options, selector } = determineArgs(...args);

  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  const misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  // Which viewports the screenshoot should adjust to & take screenshot. Supplying [] results in current viewport size.
  const viewports = options.viewports || [];

  return {
    name,
    selector,
    viewports,
    misMatchTolerance,
  };
};

const determineHelpers = {
  determineScreenshotOptions,
  determineAxeOptions,
};

export default determineHelpers;
