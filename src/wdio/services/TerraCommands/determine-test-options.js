/**
* Helper method to determine the default test options for one or two args passed.
* @param {Array} args - The list of test arguments to parse.
*     Supports [ String ], [ object ], [ string, object ]
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

  // Checked for custom axe selector, otherwise use the global value.
  const context = options.context || global.browser.options.terra.selector;

  // Which viewports the screenshot should adjust too during the test run, otherwise use's current viewport
  const { viewports } = options;

  return {
    context,
    name,
    options,
    selector,
    viewports,
  };
};

/**
* Helper method to determine the selector and axe rules for the test run.
* @param {Array} args - The list of test arguments to parse.
*/
const axeOptions = (args) => {
  const {
    context, options, selector, viewports,
  } = determineArgs(args);

  const axeRules = options.rules || options.axeRules;

  return {
    context,
    selector, // this is needed to ensure the same selector is used in Terra.should.validateElement
    ...viewports && { viewports },
    ...axeRules && { rules: axeRules },
  };
};

/**
* Helper method to determine the screenshot tag name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods. Currently supported VR comparison
* options are:
*     - viewports: [{ width: Number, height: Number }]
*     - misMatchTolerance: Number
* @param {Array} args - The list of test arguments to parse.
*/
const screenshotOptions = (args) => {
  const {
    name, options, selector, viewports,
  } = determineArgs(args);

  return {
    name,
    selector,
    ...viewports && { viewports },
    ...options.misMatchTolerance && { misMatchTolerance: options.misMatchTolerance },
  };
};

const determineHelpers = {
  screenshotOptions,
  axeOptions,
};

export default determineHelpers;
