/**
* Helper method to determine the screenshot tag name, the element selector, the viewport(s)
* in which to take the screenshots, as well as the capture screenshot options to be passed
* to the wdio-visual-regression-service comparison methods. Currently supported VR comparision
* options are:
*     - viewports: [{ width: Number, height: Number }]
*     - misMatchTolerance: Number
*     - viewportChangePause: Number
* @property {Array} args - The list of test arguments to parse.
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

  // Which viewports the screenshoot should adjust to & take screenshot. Supplying [] results in current viewport size.
  const viewports = options.viewports || [];

  const compareOptions = {};
  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  compareOptions.misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  // Check if custom viewportChangePause should be used, otherwise use the global value.
  compareOptions.viewportChangePause = options.viewportChangePause || global.browser.options.visualRegression.viewportChangePause;

  return { name, selector, viewports, options: compareOptions };
};

/**
* An assertion test helper to capture screenshots of a specified element and
* assert the screenshot comparision results are either within the mismatch tolerance or
* are an exact match.
* @property {String} testName - The test case name.
* @property {String} selector - The element to caputure in the a screenshot.
* @property {Object} options - The wdio-visual-regression-service capture screenshot options.
* @property {String} matchType - Specifies the type of matchReference assertion. Either 'withinTolerance' or 'exactly'.
*/
const assertScreenshotsMatch = (testName, selector, options, matchType) => {
  const screenshot = global.browser.checkElement(selector, options);
  global.expect(screenshot, testName).to.matchReference(matchType);
};

/**
* Generates a test for each themed property given and runs a screenshot assertion.
* @property {Array} args - An object containing the CSS custom properties to assert.
*/
const themeEachCustomProperty = (...args) => {
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

/** Helper method to create a useful test descripton.
  * @property {String} matchType - Specifies the type of matchReference assertion. Either 'withinTolerance'
  *   or 'exactly'.
  */
const getTestDescription = matchType => (
  matchType === 'withinTolerance' ? 'be within the mismatch tolerance' : 'match screenshot exactly'
);

/**
* A mocha-chai convenience test case to determines the screenshot options and test names needed to
* capture screenshots of a specified element and assert the screenshot comparision results are
* either within the mismatch tolerance or are an exact match.
* @property {Array} testArguments - The test arguments passed to the `matchScreenshotWithinTolerance`
*    or `matchScreenshotExactly` methods.
* @property {String} matchType - Specifies the type of matchReference assertion. Either 'withinTolerance'
*    or 'exactly'.
*/
const matchScreenshot = (testArguments, matchType) => {
  const { name, selector, viewports, options } = determineScreenshotOptions(...testArguments);

  const testDescription = getTestDescription(matchType);
  global.it(`[${name}] to ${testDescription}`, () => {
    if (viewports.length) {
      // Create an assertion for each viewport such that better information is provided if failure occurs for a screenshot
      viewports.forEach((viewport) => {
        options.viewports = [viewport];
        assertScreenshotsMatch(`For ${viewport.name} viewport`, selector, options, matchType);
      });
    } else {
      assertScreenshotsMatch('For current viewport', selector, options, matchType);
    }
  });
};

/**
* Mocha-chai wrapper method to capture screenshots of a specified element and assert the
* screenshot comparision results are within the mismatch tolerance.
* @property {Array} args - The list of test arguments to parse. Accepted Arguments:
*    - String (optional): the test case name. Default name is 'default'
*    - Object (optional): the test options. Options include selector, viewports,
*        misMatchTolerance and viewportChangePause.
*    Note: args list order should be: name, then options when using both.
*/
const matchScreenshotWithinTolerance = (...args) => {
  matchScreenshot(args, 'withinTolerance');
};

const methods = {
  matchScreenshotWithinTolerance,
  themeEachCustomProperty,
  getTestDescription,
};

export default methods;
