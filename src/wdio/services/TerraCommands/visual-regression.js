/**
* Helper method to determine the screenshot tag name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods. Currently supported VR comparison
* options are:
*     - viewports: [{ width: Number, height: Number }]
*     - misMatchTolerance: Number
*     - viewportChangePause: Number
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

  // Which viewports the screenshot should adjust to & take screenshot. Supplying [] results in current viewport size.
  compareOptions.viewports = options.viewports || [];

  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  compareOptions.misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  // Check if custom viewportChangePause should be used, otherwise use the global value.
  compareOptions.viewportChangePause = options.viewportChangePause || global.browser.options.visualRegression.viewportChangePause;

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
* @param {Array} args - An object containing the options for themeCombinationOfCustomProperties and  CSS custom properties to assert.
*/
const themeCombinationOfCustomProperties = (...args) => {
  if (global.browser.options.terra.disableThemeTests) {
    return;
  }

  const options = args[0];
  const selector = options.selector || global.browser.options.terra.selector;
  const styleProperties = options.properties || [];
  const testName = options.testName || 'themed';

  global.it(`[${testName}]`, () => {
    Object.entries(styleProperties).forEach(([key, value]) => {
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);
    });
    global.expect(global.browser.checkElement(selector)).to.matchReference();
  });
};

/** Helper method to create a useful test description.
  * @param {String} matchType - Specifies the type of matchReference assertion. Either 'withinTolerance'
  *   or 'exactly'.
  */
const getTestDescription = matchType => (
  matchType === 'withinTolerance' ? 'be within the mismatch tolerance' : 'match screenshot exactly'
);

/**
 * Runs the visual regression comparisons and assert the screenshot comparison results are
 * the same size and within the mismatch tolerance.
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {string} selector - the selector to use when capturing the screenshot.
 * @param {Object} [options] - the visual regression test options. Options include viewports and misMatchTolerance
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {Object} [options.viewports] - the list of Terra viewports to test.
 */
const runMatchScreenshotTest = (matchType, selector, options) => {
  const screenshots = global.browser.checkElement(selector, options);

  const { viewports } = options;
  if (viewports && viewports.length) {
    global.expect(screenshots, 'the number of screenshot results to match the number of specified viewports').to.have.lengthOf(viewports.length);
    viewports.forEach((viewport, index) => {
      screenshots[index].viewport = viewport.name;
    });
  }

  global.expect(screenshots).to.matchReference(matchType);
};

/**
* Mocha-chai wrapper method to capture screenshots of a specified element and assert the
* screenshot comparison results are within the mismatch tolerance.
*
* @param {[name, options]} [args] - the list of test arguments to parse.
* @param {string} [name=default] - the name of the visual regression test.
* @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
* @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
*    the screenshot comparison.
* @param {Object} [options.viewports] - the list of Terra viewports to test.
*/
const itMatchesScreenshot = (...args) => {
  const { name, selector, options } = determineScreenshotOptions(...args);

  const testDescription = getTestDescription('withinTolerance');
  global.it(`[${name}] to ${testDescription}`, () => {
    runMatchScreenshotTest('withinTolerance', selector, options);
  });
};

/**
 * The screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {[name, options]} [args] - the list of test arguments to parse.
 * @param {string} [name=default] - the name of the visual regression test.
 * @param {Object} [options] - the visual regression test options. Options include viewports and misMatchTolerance
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
 * @param {Object} [options.viewports] - the list of Terra viewports to test.
 */
const validatesScreenshot = (...args) => {
  const { name, selector, options } = determineScreenshotOptions(...args);

  delete options.viewports;

  runMatchScreenshotTest('withinTolerance', selector, { ...options, name });
};

const methods = {
  itMatchesScreenshot,
  validatesScreenshot,
  runMatchScreenshotTest,
  themeEachCustomProperty,
  themeCombinationOfCustomProperties,
  getTestDescription,
};

export default methods;
