/* global browser, axe */
const injectAxe = require('./inject-axe');

/**
 * Executes axe on the browser.
 * @param {Object} overrides - The axe options.
 * @param {Array} overrides.rules - The rule overrides.
 */
const runAxe = (overrides = {}) => {
  // Extract the axe options for the Terra service from the global browser object.
  const [, options = {}] = browser.options.services.find(([service]) => (
    typeof service === 'function' && service.name === 'TerraService'
  ));

  const { axe: axeOptions } = options;
  const isAxeUnavailable = browser.execute(() => window.axe === undefined);

  // Inject axe-core onto the page if it has not already been initialized.
  if (isAxeUnavailable) {
    injectAxe(axeOptions);
  }

  // Merge the global rules and overrides together.
  const rules = {
    ...axeOptions && axeOptions.rules.reduce((acc, rule) => ({ ...acc, [rule.id]: rule }), {}),
    ...overrides.rules,
  };

  // eslint-disable-next-line prefer-arrow-callback, func-names
  return browser.executeAsync(function (opts, done) {
    // eslint-disable-next-line prefer-arrow-callback, func-names
    axe.run(document, opts, function (error, result) {
      done({ error, result });
    });
  }, { rules, restoreScroll: true, runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'] });
};

module.exports = runAxe;
