/**
 * Helper method to determine which comparison results are relevant for if the chai screenshot assertion
 * fails.
 *
 * @param {Object} screenshot - The comparison result
 * @param {boolean} screenshot.isSameDimensions - If the latest screenshot was the same size as the reference screenshot.
 * @param {boolean} screenshot.isWithinMisMatchTolerance - If the latest screenshot was within the mismatch tolerance.
 * @param {boolean} screenshot.isExactSameImage - If the latest screenshot matched the reference screenshot exactly, i.e. 0% mismatch.
 * @param {Number} screenshot.misMatchPercentage - The mismatch percentage when comparing the latest screenshot to the reference screenshot.
 * @param {Number} screenshot.viewport - The viewport that the latest screenshot was taken in.
 * @returns {String} - A message describing the status of the screenshot.
 */
function getComparisonResult(screenshot) {
  const { viewport, misMatchPercentage, isSameDimensions } = screenshot;
  const relevantInformation = {};

  if (viewport) {
    relevantInformation.viewport = viewport;
  }

  if (!isSameDimensions) {
    relevantInformation.isSameDimensions = isSameDimensions;
  }

  relevantInformation.misMatchPercentage = misMatchPercentage;

  return `${JSON.stringify(relevantInformation, null, 2)}`;
}

/**
 * An assertion method to be paired with Visual Regression Service to assert each screenshot is within
 * the mismatch tolerance and are the same size.
 *
 * @param {Object} screenshot - The comparison result
 * @param {boolean} screenshot.isSameDimensions - If the latest screenshot was the same size as the reference screenshot.
 * @param {boolean} screenshot.isWithinMisMatchTolerance - If the latest screenshot was within the mismatch tolerance.
 * @param {boolean} screenshot.isExactSameImage - If the latest screenshot matched the reference screenshot exactly, i.e. 0% mismatch.
 * @param {Number} screenshot.misMatchPercentage - The mismatch percentage when comparing the latest screenshot to the reference screenshot.
 * @param {Number} screenshot.viewport - The viewport that the latest screenshot was taken in.
 * @returns {Object} - An object that indicates if the assertion passed or failed with a message.
 */
function toMatchReference(receivedScreenshot) {
  const { ignoreComparisonResults } = global.Terra.serviceOptions;
  const { isNewScreenshot, isSameDimensions, isWithinMisMatchTolerance } = receivedScreenshot;
  const comparisonResult = getComparisonResult(receivedScreenshot);

  // Validate the screenshot is the same size for the case when the new screenshot matches 100% but is 'n' pixel taller due to new content.
  // For example: the latest screenshot of a list has two more items than the reference screenshot so it is 60 pixels taller. That should fail.
  const imagesMatch = isNewScreenshot || (isSameDimensions && isWithinMisMatchTolerance);

  return {
    pass: ignoreComparisonResults || imagesMatch === true,
    message: () => `expected to be within the mismatch tolerance, but received the following comparison results \n${comparisonResult}`,
  };
}

module.exports = toMatchReference;
