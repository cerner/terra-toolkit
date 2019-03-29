import { Logger } from 'terra-scripts';

/**
* Helper method to determine the screenshot tag name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods. Currently supported VR comparision
* options are:
// *     - viewports: [{ width: Number, height: Number }]
*     - misMatchTolerance: Number
// *     - viewportChangePause: Number
* @param {Array} args - The list of test arguments to parse.
*/
const determineScreenshotOptions = (...args) => {
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

  const compareOptions = {};

  // Which viewports the screenshoot should adjust to & take screenshot. Supplying [] results in current viewport size.
  // compareOptions.viewports = options.viewports || [];

  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  compareOptions.misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  // Check if custom viewportChangePause should be used, otherwise use the global value.
  // compareOptions.viewportChangePause = options.viewportChangePause || global.browser.options.visualRegression.viewportChangePause;

  return { name, selector, options: compareOptions };
};

/**
* Generates a test for each themed property given and runs a screenshot assertion.
* @param {Array} args - An object containing the CSS custom properties to assert.
*/
const themeEachCustomProperty = (...args) => {
  if (global.browser.options.terra.disableThemeTests) {
    return;
  }

  // If more than 1 argument, selector is first
  const selector = args.length > 1 ? args[0] : global.browser.options.terra.selector;
  // Style properties are always last.
  const styleProperties = args[args.length - 1];

  Object.entries(styleProperties).forEach(([key, value]) => {
    global.it(`themed [${key}]`, () => {
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);
      global.expect(global.browser.checkElement(selector)).to.matchReference();
    });
  });
};

/**
* Generates a test for a combination of themed properties given and runs a screenshot assertion.
*
* @param {Array} args - An object containing the options for themeCombinationOfCustomProperties and CSS custom properties to assert.
*/
const themeCombinationOfCustomProperties = (...args) => {
  if (global.browser.options.terra.disableThemeTests) {
    return;
  }

  const selector = args[0].selector ? args[0].selector : global.browser.options.terra.selector;
  const styleProperties = args[0].properties ? args[0].properties : [];

  if (!args[0].testName) {
    throw Logger.error(`A test name for themeCombinationOfCustomProperties test is not provided.
A testName property should be set in the options object passed to the themeCombinationOfCustomProperties to uniquely identify it.`);
  }

  global.it(`[${args[0].testName}]`, () => {
    Object.entries(styleProperties).forEach(([key, value]) => {
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);
    });
    global.expect(global.browser.checkElement(selector)).to.matchReference();
  });
};

/**
 * The actual it block for the screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 * @param {String} name the test case name
 * @param {String} selector the selector to use when capturing the screenshot.
 * @param {Object} options the test options. Options include misMatchTolerance.
 */
const screenshotItBlock = (name, selector, options) => {
  global.it(`[${name}] to be within the mismatch tolerance`, () => {
    const screenshots = global.browser.checkElement(selector, options);

    // const { viewports } = options;
    // if (viewports && viewports.length) {
    //   global.expect(screenshots, 'the number of screenshot results to match the number of specified viewports').to.have.lengthOf(viewports.length);
    //   viewports.forEach((viewport, index) => {
    //     screenshots[index].viewport = viewport.name;
    //   });
    // }

    global.expect(screenshots).to.matchReference(matchType);
  });
};


/**
* Mocha-chai wrapper method to capture screenshots of a specified element and assert the
* screenshot comparision results are within the mismatch tolerance.
* @param {Array} args - The list of test arguments to parse. Accepted Arguments:
*    - String (optional): the test case name. Default name is 'default'
*    - Object (optional): the test options. Options include selector, viewports,
*        misMatchTolerance and viewportChangePause.
*    Note: args list order should be: name, then options when using both.
*/
const matchScreenshot = (...args) => {
  const { name, selector, options } = determineScreenshotOptions(...args);
  screenshotItBlock(name, matchType, selector, options);
};

const methods = {
  matchScreenshot,
  screenshotItBlock,
  themeEachCustomProperty,
  themeCombinationOfCustomProperties,
};

export default methods;
