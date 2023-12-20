const path = require('path');
const fs = require('fs-extra');
const { Logger } = require('@cerner/terra-cli');
const getOutputDir = require('../../reporters/spec-reporter/get-output-dir');
const { BUILD_BRANCH, BUILD_TYPE } = require('../../constants');

const logger = new Logger({ prefix: '[terra-functional-testing:toMatchReference]' });
/**
 * An assertion method to be paired with Visual Regression Service to assert each screenshot is within
 * the mismatch tolerance and are the same size.
 *
 * @param {Object} screenshot - The comparison result.
 * @param {boolean} screenshot.isNewScreenshot - If the latest screenshot was a new screenshot that has no reference screenshot.
 * @param {boolean} screenshot.isSameDimensions - If the latest screenshot was the same size as the reference screenshot.
 * @param {boolean} screenshot.isWithinMismatchTolerance - If the latest screenshot was within the mismatch tolerance.
 * @param {number} screenshot.misMatchPercentage - The mismatch percentage when comparing the latest screenshot to the reference screenshot.
 * @param {boolean} screenshot.screenshotWasUpdated - If the reference screenshot was updated with the latest captured screenshot.
 * @returns {Object} - An object that indicates if the assertion passed or failed with a message.
 */
function toMatchReference(screenshot, testName) {
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

  let pass = global.Terra.serviceOptions.ignoreScreenshotMismatch || imagesMatch;

  if (global.Terra.serviceOptions.useRemoteReferenceScreenshots && !pass
    && (global.Terra.serviceOptions.buildBranch.match(BUILD_BRANCH.pullRequest) || global.Terra.serviceOptions.buildType === BUILD_TYPE.branchEventCause)) {
    pass = true;
    const outputDir = getOutputDir();
    const fileName = path.join(outputDir, 'ignored-mismatch.json');
    // Create the output directory if it does not already exist.
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      // Since  output directory didn't exist file couldnt so just go ahead and make the file
      fs.writeFileSync(fileName, JSON.stringify({ screenshotMismatched: true }, null, 2));
    } else if (!fs.existsSync(fileName)) {
      // If output directory exists but mismatch file has not been created create one
      fs.writeFileSync(fileName, JSON.stringify({ screenshotMismatched: true }, null, 2));
    }

    logger.info(`Test: '${testName}' has a mismatch difference of ${misMatchPercentage}% and needs to be reviewed.`);
  }

  return {
    pass,
    message: () => message,
  };
}

module.exports = toMatchReference;
