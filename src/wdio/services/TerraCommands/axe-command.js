
/* global browser, axe */
import fs from 'fs';

let axeCoreSrc;

const injectAxe = (axeOptions) => {
  if (!axeCoreSrc) {
    axeCoreSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
    axeCoreSrc = axeCoreSrc.replace(/^\/\*.*\*\//, '');

    if (axeOptions) {
      const axeJsonConfigure = `axe.configure(${JSON.stringify(axeOptions)})`;
      axeCoreSrc = `${axeCoreSrc}\n${axeJsonConfigure};`;
    }
  }
  browser.execute(axeCoreSrc);
};

const runAxeTest = (rules) => {
  /* Avoid arrow callback syntax as this function is injected into the browser */
  /* eslint-disable func-names, prefer-arrow-callback, object-shorthand */
  const axeResult = browser.executeAsync(function (opts, done) {
    axe.run(document, opts, function (error, result) {
      done({ error, result });
    });
  }, { rules, restoreScroll: true, runOnly: ['wcag2aa', 'section508'] });
  /* eslint-enable func-names, prefer-arrow-callback, object-shorthand */

  return axeResult.value;
};

const axeCommand = (testOptions = {}) => {
  const globalConfig = browser.options.axe || {};

  /**
   * Conditionally inject axe. This allows consumers to inject it themselves in
   * the test examples which would slightly speed up test runs.
   */
  const injectScript = globalConfig.inject || false;
  if (injectScript && browser.execute('return window.axe === undefined;')) {
    injectAxe(globalConfig.options);
  }

  const {
    rules,
    viewports,
  } = testOptions;

  if (!viewports) {
    // analyze the current viewport
    return [runAxeTest(rules)];
  }

  // get the current viewport
  const currentViewportSize = browser.getViewportSize();

  // Get accessibility results for each specified viewport size
  const results = viewports.map((viewport) => {
    browser.setViewportSize(viewport);
    return runAxeTest(rules);
  });

  // reset viewport back to the current viewport
  browser.setViewportSize(currentViewportSize);

  return results;
};

export default axeCommand;
