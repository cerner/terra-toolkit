
/* global browser, axe */
import fs from 'fs';

let axeCoreSrc;

/**
* Injects Axe on the on the test page and configures it options are included in the
* wdio configuration.
*
* @param {Object} [options] - the Axe test options
*/
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

/**
* Runs Axe against test page to check for WCAG 2.0 AA and Section 508 violations.
*
* @param {Object} [rules] - the axe rules to use to use in the axe run.
*
* @returns {Object} axeResults - the axe results as list of passes, violations, incomplete and inapplicable.
*/
const runAxeTest = (rules) => {
  /* Avoid arrow callback syntax as this function is injected into the browser */
  /* eslint-disable func-names, prefer-arrow-callback, object-shorthand */
  const axeResult = browser.executeAsync(function (opts, done) {
    axe.run(document, opts, function (error, result) {
      done({ error, result });
    });
  }, { rules, restoreScroll: true, runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'] });
  /* eslint-enable func-names, prefer-arrow-callback, object-shorthand */

  return axeResult.value;
};

/**
* Custom wdio command to test accessibly on the page for each viewport defined.
*
* @param {Object} [options] - the Axe test options
* @param {Object} [rules] - the axe rules to use to use in the axe run.
* @param {Object[]} [options.viewports] - the list of Terra viewports to test.
*
* @returns {Object} axeResults - the axe results as list of passes, violations, incomplete and inapplicable.
*/
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

  const globalAxeRules = (browser.options.axe && browser.options.axe.options) ? browser.options.axe.options.rules : undefined;
  // Converting `globalAxeRules` from array of rules object to object of rules.
  const formattedGlobalRules = globalAxeRules && globalAxeRules.reduce((formattedRules, rule) => {
    const { id, ...rest } = rule;
    const rulesObject = formattedRules;
    rulesObject[id] = rest;
    return rulesObject;
  }, {});

  const axeRules = (formattedGlobalRules || rules) && { ...formattedGlobalRules, ...rules };

  if (!viewports) {
    // analyze the current viewport
    return [runAxeTest(axeRules)];
  }

  // get the current viewport
  const currentViewportSize = browser.getViewportSize();

  // Get accessibility results for each specified viewport size
  const results = viewports.map((viewport) => {
    browser.setViewportSize(viewport);
    return runAxeTest(axeRules);
  });

  // reset viewport back to the current viewport
  browser.setViewportSize(currentViewportSize);

  return results;
};

export default axeCommand;
