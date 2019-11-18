/**
* Helper method to determine the default test options for one or two args passed.
*
* @param {[name, options]} [args] - the list of test arguments to parse.
* @param {string} [name=default] - the name of the visual regression test.
* @param {Object} [options] - the test options
* @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
*    the screenshot comparison.
* @param {Object[]} [options.viewports] - the list of Terra viewports to test.
*
*/
const determineArgs = (args) => {
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

  // Which viewports the screenshot should adjust too during the test run, otherwise use's current viewport
  const { viewports } = options;

  return {
    name,
    options,
    selector,
    viewports,
  };
};

/**
* Helper method to determine the viewports and axe rules for the test run.
*
* @param {[options]} [args] - the list of test arguments to parse.
* @param {Object} [options.axeRules] - the axe rules to use to use in the axe run.
* @param {Object} [options.rules] - the axe rules to use to use in the axe run.
* @param {Object} [options.viewports] - the list of Terra viewports to test.
*/
const axeOptions = (args) => {
  const {
    options, viewports,
  } = determineArgs(args);

  const globalAxeRules = global.browser.options.axe.options.rules;
  const customAxeRules = options.rules || options.axeRules;
  const axeRules = { ...globalAxeRules, ...customAxeRules };

  return {
    ...viewports && { viewports },
    ...axeRules && { rules: axeRules },
  };
};

/**
* Helper method to determine the screenshot name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods.
*
* @param {[name, options]} [args] - the list of test arguments to parse.
* @param {string} [name=default] - the name of the visual regression test.
* @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
* @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
*    the screenshot comparison.
* @param {Object} [options.viewports] - the list of Terra viewports to test.
*/
const screenshotOptions = (args) => {
  const {
    name, options, selector, viewports,
  } = determineArgs(args);

  return {
    name,
    selector,
    ...viewports && { viewports },
    ...(options.misMatchTolerance !== undefined) && { misMatchTolerance: options.misMatchTolerance },
  };
};

const determineHelpers = {
  screenshotOptions,
  axeOptions,
};

export default determineHelpers;
