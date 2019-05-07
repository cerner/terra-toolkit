import chai from 'chai';
import visualRegression from './visual-regression';

/**
  * A accessible chai assertion to be paired with browser.axe() tests.
  */
function accessible() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);
  // eslint-disable-next-line no-underscore-dangle
  const errors = this._obj
    .filter(test => test.result)
    .reduce((all, test) => all.concat(test.result.violations), [])
    .filter(test => test)
    .map(test => `${JSON.stringify(test, null, 2)}`);

  this.assert(
    errors.length === 0,
    `expected no accessibility violations but got:\n\t${errors[0]}`,
    'expected accessibilty errors but received none',
  );
}

/** Helper method to determine which comparision results are relevant if the chai
  * screenshot assertion fails.
  * @property {Array of Objects} screenshots - The list of comparision results. The results
  *    contain: misMatchPercentage (number), isSameDimensions (bool), isWithinMisMatchTolerance
  *    (bool) and isExactSameImage (bool).
  * @property {bool} matchExactly - If the screenshots should be an exact match.
  */
const getComparisonResults = (screenshots, matchExactly) => {
  if (screenshots.length < 1) {
    return 'No screenshots to compare.';
  }

  const results = screenshots.map((comparison) => {
    const {
      viewport, misMatchPercentage, isSameDimensions, isExactSameImage,
    } = comparison;
    const relevantInformation = {};

    if (viewport) {
      relevantInformation.viewport = viewport;
    }

    if (!isSameDimensions) {
      relevantInformation.isSameDimensions = isSameDimensions;
    }

    if (matchExactly) {
      relevantInformation.isExactSameImage = isExactSameImage;
    }

    relevantInformation.misMatchPercentage = misMatchPercentage;

    return `${JSON.stringify(relevantInformation, null, 2)}`;
  });

  return results;
};

/** A visual regression chai assertion to be paired with browser.capture() visual regression tests.
  * Checks if the screenshot(s) are the same size and verifies the screenshots are either within
  * the mismatch tolerance match or an exact match.
  * @property {String} matchType - Which assertion to make. Either 'withinTolerance' or 'exactly'.
  *     Defaults to 'withinTolerance'.
  */
function matchReference(matchType = 'withinTolerance') {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);

  if (matchType) {
    new chai.Assertion(matchType).to.be.oneOf(['withinTolerance', 'exactly']);
  }

  // eslint-disable-next-line no-underscore-dangle
  const screenshots = this._obj;
  const matchExactly = matchType === 'exactly';

  const testDescription = visualRegression.getTestDescription(matchType);
  const comparisonResults = getComparisonResults(screenshots, matchExactly);

  let imagesMatch;
  if (matchExactly) {
    imagesMatch = screenshots.every(screenshot => (screenshot && screenshot.isSameDimensions && screenshot.isExactSameImage));
  } else {
    imagesMatch = screenshots.every(screenshot => (screenshot && screenshot.isSameDimensions && screenshot.isWithinMisMatchTolerance));
  }

  this.assert(
    imagesMatch === true,
    `expected to ${testDescription}, but received the following comparison results \n${comparisonResults}`,
    `did not expected to ${testDescription}, but received the following comparison results \n${comparisonResults}`,
  );
}

const chaiMethods = {
  accessible,
  getComparisonResults,
  matchReference,
};

export default chaiMethods;
