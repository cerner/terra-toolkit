import determineOptions from './determine-test-options';

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
      // add document level style override
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);

      let screenshotFailure;
      try {
        // take screenshot
        global.expect(global.browser.checkElement(selector)).to.matchReference();
      } catch (err) {
        // it failed. that fine but we still need to clean up the themed styles
        screenshotFailure = err;
      } finally {
        // remove documented defined style override
        global.browser.execute(`document.documentElement.style.setProperty('${key}', '')`);

        // re-throw failed screenshot error
        if (screenshotFailure) {
          // eslint-disable-next-line no-unsafe-finally
          throw Error(screenshotFailure);
        }
      }
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
    // add document level style override
    Object.entries(styleProperties).forEach(([key, value]) => {
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);
    });

    let screenshotFailure;
    try {
    // take screenshot
      global.expect(global.browser.checkElement(selector)).to.matchReference();
    } catch (err) {
      // it failed. that fine but we still need to clean up the themed styles
      screenshotFailure = err;
    } finally {
      // remove documented defined style overrides
      Object.entries(styleProperties).forEach(([key]) => {
        global.browser.execute(`document.documentElement.style.setProperty('${key}', '')`);
      });

      // re-throw failed screenshot error
      if (screenshotFailure) {
        // eslint-disable-next-line no-unsafe-finally
        throw Error(screenshotFailure);
      }
    }
  });
};

/**
 * The actual it block for the screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 * @param {String} name the test case name
 * @param {String} selector the selector to use when capturing the screenshot.
 * @param {Object} options the test options. Options include viewports and misMatchTolerance
 */
const screenshotItBlock = (name, selector, options) => {
  global.it(`[${name}] to be within the mismatch tolerance`, () => {
    const screenshots = global.browser.checkElement(selector, options);

    const { viewports } = options;
    if (viewports && viewports.length) {
      global.expect(screenshots, 'the number of screenshot results to match the number of specified viewports').to.have.lengthOf(viewports.length);

      // add viewport name for meanful results message if a failure occurs
      viewports.forEach((viewport, index) => {
        screenshots[index].viewport = viewport.name;
      });
    }

    global.expect(screenshots).to.matchReference();
  });
};

/**
* Mocha-chai wrapper method to capture screenshots of a specified element and assert the
* screenshot comparison results are within the mismatch tolerance.
* @param {Array} args - The list of test arguments to parse. Accepted Arguments:
*    - String (optional): the test case name. Default name is 'default'
*    - Object (optional): the test options. Options include selector, and viewports,
*        misMatchTolerance.
*    Note: args list order should be: name, then options when using both.
*/
const matchScreenshot = (...args) => {
  const {
    name, selector, misMatchTolerance, viewports,
  } = determineOptions.screenshotOptions(args);

  screenshotItBlock(name, selector, { misMatchTolerance, viewports });
};

const methods = {
  matchScreenshot,
  screenshotItBlock,
  themeEachCustomProperty,
  themeCombinationOfCustomProperties,
};

export default methods;
