const { runAxe } = require('../axe');

/**
 * Invokes axe analysis on the current document and asserts there are no accessibility violations.
 * @param {*} _ - Unused param. The expect is always run on the current document.
 * @param {Object} options - Optional axe configuration overrides.
 * @returns {Object} - An object that indicates if the assertion passed or failed with a message.
 */
function toBeAccessible(_, options = {}) {
  const { result } = runAxe(options);
  const { violations } = result;

  return {
    pass: violations.length === 0,
    message: () => `expected no accessibility violations but received ${JSON.stringify(violations, null, 2)}`,
  };
}

module.exports = toBeAccessible;
