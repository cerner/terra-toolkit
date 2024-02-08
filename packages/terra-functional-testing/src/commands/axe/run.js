/* global browser, axe, Terra */
const { source } = require('axe-core/axe.min');
/**
 * Executes axe on the browser.
 * @param {Object} options - The axe options.
 * @param {array} options.rules - The rule overrides.
*/
const runAxe = async (options = {}) => {
  const axeOptions = {
    rules: {
      ...Terra.axe.rules,
      ...options.rules,
    },
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508'],
  };

  await browser.execute(source);

  // eslint-disable-next-line prefer-arrow-callback, func-names
  const results = await browser.executeAsync(function (opts, done) {
    // eslint-disable-next-line prefer-arrow-callback, func-names
    axe.run(document, opts, function (error, result) {
      // eslint-disable-next-line object-shorthand
      done({ error: error, result: result }); // IE 10 does not support object short hand. This line must explicity define the key and value of the object.
    });
  }, axeOptions);

  return results;
};

module.exports = runAxe;
