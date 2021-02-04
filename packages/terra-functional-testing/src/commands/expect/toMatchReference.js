/**
 * An assertion method to be paired with Visual Regression Service to assert each screenshot is within
 * the mismatch tolerance and are the same size.
 *
 * @param {Object} screenshot - The comparison result.
 * @param {Boolean} screenshot.isNewScreenshot - If the latest screenshot was a new screenshot that has no reference screenshot.
 * @param {Boolean} screenshot.isSameDimensions - If the latest screenshot was the same size as the reference screenshot.
 * @param {Boolean} screenshot.isWithinMismatchTolerance - If the latest screenshot was within the mismatch tolerance.
 * @param {Number} screenshot.misMatchPercentage - The mismatch percentage when comparing the latest screenshot to the reference screenshot.
 * @param {Boolean} screenshot.screenshotWasUpdated - If the reference screenshot was updated with the latest captured screenshot.
 * @returns {Object} - An object that indicates if the assertion passed or failed with a message.
 */
function toMatchReference(screenshot) {
  const {
    isNewScreenshot,
    isSameDimensions,
    isWithinMismatchTolerance,
    misMatchPercentage,
    screenshotWasUpdated,
  } = screenshot;

  // Validate the screenshot is the same size for the case when the new screenshot matches 100% but is 'n' pixel taller due to new content.
  // For example: the latest screenshot of a list has two more items than the reference screenshot so it is 60 pixels taller. That should fail.
  const imagesMatch = isNewScreenshot || screenshotWasUpdated || (isSameDimensions && isWithinMismatchTolerance);
  let message = '';

  if (!isSameDimensions) {
    message = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.';
  }

  if (misMatchPercentage) {
    if (message.length > 0) {
      message = message.concat('\n');
    }
    message = message.concat(`Expected the screenshot to be within the mismatch tolerance, but received a mismatch difference of ${misMatchPercentage}%.`);
  }

  return {
    pass: imagesMatch === true,
    message: () => message,
  };
}

module.exports = toMatchReference;
