const { runAxe } = require('../axe');

/**
 * Invokes axe analysis on the current document and asserts there are no accessibility violations.
 * @param {*} _ - Unused param. The expect is always run on the current document.
 * @param {Object} options - Optional axe configuration overrides.
 * @returns {Object} - An object that indicates if the assertion passed or failed with a message.
 */
function toBeAccessible(_, options = {}) {
  const { result } = runAxe(options);
  const { incomplete, violations } = result;

  // Rules that fail but are marked for review are returned in the incomplete array.
  // https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#results-object
  if (incomplete && incomplete.length > 0) {
    process.emit('terra:report:accessibility', { incomplete });
  }

  return {
    pass: violations.length === 0,
    message: () => `expected no accessibility violations but received ${JSON.stringify(violations, null, 2)}`,
  };
}

module.exports = toBeAccessible;
