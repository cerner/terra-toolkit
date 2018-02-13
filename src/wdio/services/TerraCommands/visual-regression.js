const createScreenshotOptions = (...args) => {
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

  // Check if custom selector should be used
  const selector = options.selector || global.browser.options.terra.selector;

  // Which viewports the screenshoot should adjust to & take screenshot. Supplying [] results in current viewport size.
  const viewports = options.viewports || [];

  const matchType = options.matchType || undefined;

  const compareOptions = {};
  // Check if custom misMatchTolerance should be used, otherwise use the global value
  compareOptions.misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  // Check if custom viewportChangePause should be used, otherwise use the global value
  compareOptions.viewportChangePause = options.viewportChangePause || global.browser.options.visualRegression.compare.viewportChangePause;

  return { name, selector, viewports, matchType, options: compareOptions };
};

const itMatchesScreenshot = (testCaseName, selector, options, matchType) => {
  global.it(`${testCaseName}`, () => {
    const screenshot = global.browser.checkElement(selector, options);
    global.expect(screenshot).to.matchReference(matchType);
  });
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

const matchScreenshot = (...args) => {
  const { name, selector, viewports, matchType, options } = createScreenshotOptions(...args);

  if (viewports.length) {
    // Create assertion for each viewport so know which screenshots pass/fail comparison
    viewports.forEach((viewport) => {
      const testCaseName = `[${name}] matches screenshot for ${viewport.name} viewport`;
      options.viewports = [viewport];
      itMatchesScreenshot(testCaseName, selector, options, matchType);
    });
  } else {
    itMatchesScreenshot(`[${name}] matches screenshot`, selector, options, matchType);
  }
};

const shouldMatchScreenshot = (...args) => {
  const { name, selector, viewports, matchType, options } = createScreenshotOptions(...args);

  // if (viewports.length) {
  //   // Create assertion for each viewport so know which screenshots pass/fail comparison
  //   viewports.forEach((viewport) => {
  //     // const testCaseName = `[${name}] matches screenshot for ${viewport.name} viewport`;
  //     // options.viewports = [viewport];
  //     // itMatchesScreenshot(testCaseName, selector, options, matchType);
  //     const screenshot = global.browser.checkElement(selector, options);
  //     global.expect(screenshot).to.matchReference(matchType);
  //   });
  // } else {
    // itMatchesScreenshot(`[${name}] matches screenshot`, selector, options, matchType);
    const screenshot = global.browser.checkElement(selector, { ...options, viewports });
    global.expect(screenshot).to.matchReference(matchType);
  // }
};

const methods = {
  matchScreenshot,
  themeEachCustomProperty,
  shouldMatchScreenshot,
};

export default methods;
