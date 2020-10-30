/* global browser, axe */
const injectAxe = require('./inject');

/**
 * Global rule overrides.
 * Rules modified here will be applied globally for all tests.
 */
const GLOBAL_RULE_OVERRIDES = {
  /**
   * This rule was introduced in axe-core v3.3 and causes failures in many Terra components.
   * The solution to address this failure vary by component. It is being disabled until a solution is identified in the future.
   *
   * Reference: https://github.com/cerner/terra-framework/issues/991
   */
  'scrollable-region-focusable': { enabled: false },
};

/**
 * Executes axe on the browser.
 * @param {Object} options - The axe options.
 * @param {Object} options.rules - The rule overrides.
 */
const runAxe = (options = {}) => {
  // Extract the axe options for the Terra service from the global browser object.
  const [, serviceOptions = {}] = browser.options.services.find(([service]) => (
    typeof service === 'function' && service.name === 'TerraService'
  ));

  const { axe: axeServiceOptions = {} } = serviceOptions;

  const isAxeUnavailable = browser.execute(() => window.axe === undefined);

  // Inject axe-core onto the page if it has not already been initialized.
  if (isAxeUnavailable) {
    const globalRules = { ...GLOBAL_RULE_OVERRIDES, ...axeServiceOptions.rules };

    // The axe.configure API requires the rules to be an array of objects.
    const globalRulesArray = Object.keys(globalRules).map((rule) => (
      { ...globalRules[rule], id: rule }
    ));

    injectAxe({ ...axeServiceOptions, rules: globalRulesArray });
  }

  const rules = {
    ...GLOBAL_RULE_OVERRIDES,
    ...axeServiceOptions.rules,
    ...options.rules,
  };

  // eslint-disable-next-line prefer-arrow-callback, func-names
  return browser.executeAsync(function (opts, done) {
    // eslint-disable-next-line prefer-arrow-callback, func-names
    axe.run(document, opts, function (error, result) {
      done({ error, result });
    });
  }, { rules, runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'] });
};

module.exports = runAxe;
