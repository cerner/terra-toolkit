/**
 * Analyzes the current documentation for accessibility violations.
 * @param {Object} options - Optional axe configuration overrides.
 */
async function accessibility(options = {}) {
  await expect().toBeAccessible(options);
}

module.exports = accessibility;
