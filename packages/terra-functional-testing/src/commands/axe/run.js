/* global browser, Terra */
const { AxeBuilder } = require('@axe-core/webdriverio');
/**
 * Executes axe on the browser.
 * @param {Object} options - The axe options.
 * @param {array} options.rules - The rule overrides.
*/
const runAxe = async (options = {}) => {
  const rules = Object.entries({
    ...Terra.axe.rules,
    ...options.rules,
  });

  const enabledRules = rules.filter(rule => rule[1].enabled).map(rule => rule[0]);
  const disabledRules = rules.filter(rule => rule[1].enabled === false).map(rule => rule[0]);

  const axe = new AxeBuilder({ client: browser })
    .withRules(enabledRules)
    .disableRules(disabledRules)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'])
    .setLegacyMode(true);

  const results = await axe.analyze();

  return {
    result: {
      violations: results.violations,
    },
  };
};

module.exports = runAxe;
