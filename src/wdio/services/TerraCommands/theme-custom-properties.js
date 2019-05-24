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

const methods = {
  themeEachCustomProperty,
  themeCombinationOfCustomProperties,
};

export default methods;
