import chai from 'chai';

/**
  * A chai assertion method to be paired with browser.axe() tests to assert no violations were found
  * on the test page.
  */
function accessible() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);

  // These are the new rules introduced in axe-core v3.3 and v3.4 to disable for now to remain passive.
  const axeRuleIdsToDisable = [
    'aria-input-field-name',
    'aria-roledescription',
    'aria-toggle-field-name',
    'avoid-inline-spacing',
    'input-button-name',
    'landmark-unique',
    'role-img-alt',
    'scrollable-region-focusable',
  ];

  // eslint-disable-next-line no-underscore-dangle
  const errors = this._obj
    .filter(test => test.result)
    .reduce((all, test) => all.concat(test.result.violations), [])
    .filter(test => !axeRuleIdsToDisable.includes(test.id))
    .filter(test => test)
    .map(test => `${JSON.stringify(test, null, 2)}`);

  this.assert(
    errors.length === 0,
    `expected no accessibility violations but got:\n\t${errors[0]}`,
    'expected accessibility errors but received none',
  );
}

/**
 * Helper method to determine which comparison results are relevant for if the chai screenshot assertion
 * fails.
 *
 * @param {Object[]} screenshots - The list of comparison results
 * @param {boolean} screenshot.isSameDimensions - If the latest screenshot was the same size as the
 *    reference screenshot.
 * @param {boolean} screenshot.isWithinMisMatchTolerance - If the latest screenshot was within the
 *    mismatch tolerance.
 * @param {boolean} screenshot.isExactSameImage - If the latest screenshot matched the reference
 *    screenshot exactly, i.e. 0% mismatch.
 * @param {Number} screenshot.misMatchPercentage - The mismatch percentage when comparing the latest
 *    screenshot to the reference screenshot.
 * @param {Number} screenshot.viewport - The viewport that the latest screenshot was taken in.
 */
const getComparisonResults = (screenshots) => {
  if (screenshots.length < 1) {
    return 'No screenshots to compare.';
  }

  const results = screenshots.map((comparison) => {
    const {
      viewport, misMatchPercentage, isSameDimensions,
    } = comparison;
    const relevantInformation = {};

    if (viewport) {
      relevantInformation.viewport = viewport;
    }

    if (!isSameDimensions) {
      relevantInformation.isSameDimensions = isSameDimensions;
    }

    relevantInformation.misMatchPercentage = misMatchPercentage;

    return `${JSON.stringify(relevantInformation, null, 2)}`;
  });

  return results;
};

/**
 * A chai assertion method to be paired with Visual Regression Service to assert each screenshot is within
 * the mismatch tolerance and are the same size.
 */
function matchReference() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);

  // eslint-disable-next-line no-underscore-dangle
  const screenshots = this._obj;

  const comparisonResults = getComparisonResults(screenshots);

  // Validate the screenshot is the same size for the case when the new screenshot matches 100% but is 'n' pixel taller due to new content.
  // For example: the latest screenshot of a list has two more items than the reference screenshot so it is 60 pixels taller. That should fail.
  const imagesMatch = screenshots.every(screenshot => (screenshot && screenshot.isSameDimensions && screenshot.isWithinMisMatchTolerance));

  const { ignoreComparisonResults } = global.browser.options.visualRegression;
  this.assert(
    ignoreComparisonResults || imagesMatch === true,
    `expected to be within the mismatch tolerance, but received the following comparison results \n${comparisonResults}`,
    `did not expect to be within the mismatch tolerance, but received the following comparison results \n${comparisonResults}`,
  );
}

const chaiMethods = {
  accessible,
  getComparisonResults,
  matchReference,
};

export default chaiMethods;
