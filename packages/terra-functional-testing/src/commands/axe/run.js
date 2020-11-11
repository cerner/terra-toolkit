/* global browser, axe, Terra */
const injectAxe = require('./inject');

/**
 * Executes axe on the browser.
 * @param {Object} options - The axe options.
 * @param {Array} options.rules - The rule overrides.
 */
const runAxe = (options = {}) => {
  const isAxeUnavailable = browser.execute(() => window.axe === undefined);

  // Inject axe-core onto the page if it has not already been initialized.
  if (isAxeUnavailable) {
    /**
     * Converts the global rule overrides into an array.
     * The axe.configure API requires the rules to be an array of objects. The axe.run API requires
     * the rules to be an object keyed by the rule ID.
     */
    const globalRuleArray = Object.keys(Terra.axe.rules).map((rule) => (
      { ...Terra.axe.rules[rule], id: rule }
    ));

    injectAxe({ rules: globalRuleArray });
  }

  // Merge the global rules and option overrides together.
  const rules = { ...Terra.axe.rules, ...options.rules };

  // eslint-disable-next-line prefer-arrow-callback, func-names
  return browser.executeAsync(function (opts, done) {
    // eslint-disable-next-line prefer-arrow-callback, func-names
    axe.run(document, opts, function (error, result) {
      done({ error, result });
    });
  }, { rules, runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'] });
};

module.exports = runAxe;
