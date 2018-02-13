import chai from 'chai';

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

  this.assert(errors.length === 0,
    `expected no accessibility violations but got:\n\t${errors[0]}`,
    'expected accessibilty errors but received none');
}

const getComparisonResults = (screenshots, isExactMatch) => (
  screenshots.map((comparison) => {
    const { misMatchPercentage, isSameDimensions, isExactSameImage } = comparison;
    const relevantInformation = {};

    if (!isSameDimensions) {
      relevantInformation.isSameDimensions = isSameDimensions;
    }

    if (isExactMatch) {
      relevantInformation.isExactSameImage = isExactSameImage;
    } else {
      relevantInformation.misMatchPercentage = misMatchPercentage;
    }

    return `${JSON.stringify(relevantInformation, null, 2)}`;
  })
);

/** Checks if the screenshot(s) are the same size and are within the mismatch tolerance match
  * A chai assertion to be paired with browser.capture() visual regression tests.
  */
function matchReference(matchType = 'withinTolerance') {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);

  if (matchType) {
    new chai.Assertion(matchType).to.be.oneOf(['withinTolerance', 'exact']);
  }
  // eslint-disable-next-line no-underscore-dangle
  const screenshots = this._obj;
  const isExactMatch = matchType === 'exact';

  const comparisonResults = getComparisonResults(screenshots, isExactMatch);

  let imagesMatch;
  if (isExactMatch) {
    imagesMatch = screenshots.every(screenshot => (screenshot && screenshot.isSameDimensions && screenshot.isExactSameImage));
  } else {
    imagesMatch = screenshots.every(screenshot => (screenshot && screenshot.isSameDimensions && screenshot.isWithinMisMatchTolerance));
  }

  this.assert(imagesMatch === true,
    `expected screenshot(s) to be match reference, but recieve the following comparison results \n${comparisonResults}`,
    `expected screenshot(s) to not match reference, but recieve the following comparison results \n${comparisonResults}`);
}

const chaiMedthods = {
  accessible,
  matchReference,
};

export default chaiMedthods;
