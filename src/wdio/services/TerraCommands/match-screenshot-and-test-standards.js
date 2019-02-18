import accessibilityMethods from './accessiblity';
import visualRegressionMethods from './visual-regression';

const determineOptions = (...args) => {
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

  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  const misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  return {
    name,
    selector,
    misMatchTolerance,
    axeOptions: { ...options.axeRules, context: selector },
  };
};

const matchScreenshotAndTestStandards = (...args) => {
  const {
    name,
    selector,
    misMatchTolerance,
    axeOptions,
  } = determineOptions(...args);

  accessibilityMethods.beAccessible(axeOptions);
  visualRegressionMethods.matchScreenshotImplementation(name, 'withinTolerance', selector, { misMatchTolerance });
};

export default matchScreenshotAndTestStandards;
