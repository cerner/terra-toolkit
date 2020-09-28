/* eslint-disable class-methods-use-this, no-unused-vars */

export default class BaseCompare {
  /**
   * You can do here your image comparison magic.
   */
  async processScreenshot(context, base64Screenshot) {
    return Promise.resolve();
  }

  /**
   * Creates the screenshot comparison report object.
   *
   * @param {Number} misMatchPercentage - the percent mismatched of the latest screenshot compared to the reference screenshot
   * @param {Boolean} isWithinMisMatchTolerance - whether or not the latest screenshot is a close enough match the reference screenshot
   * @param {Boolean} isSameDimensions - whether or not the latest screenshot was the same dimensions as the reference screenshot
   * @return {{misMatchPercentage: Number,isWithinMisMatchTolerance: Boolean, isSameDimensions: Boolean, isExactSameImage: Boolean}}
   */
  createResultReport(misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions) {
    return {
      misMatchPercentage,
      isWithinMisMatchTolerance,
      isSameDimensions,
      isExactSameImage: misMatchPercentage === 0,
    };
  }
}
