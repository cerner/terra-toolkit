import resemble from 'node-resemble-js';
import get from 'lodash.get';

export default class TerraCompare {
  constructor(config) {
    this.screenshotProcessor = config.screenshotProcessor;
    this.failInCIOnMissingReferenceShots = config.failInCIOnMissingReferenceShots;

    this.misMatchTolerance = get(config, 'misMatchTolerance', 0.01);
    this.ignoreComparison = get(config, 'ignoreComparison', 'nothing');
  }

  async processScreenshot(context, base64Screenshot) {
    const referenceScreenshotData = await this.screenshotProcessor.getReferenceScreenshotData(context);
    const latestScreenshotData = Buffer.from(base64Screenshot, 'base64');
    const ignoreComparison = get(context, 'options.ignoreComparison', this.ignoreComparison);
    await this.screenshotProcessor.saveLatestScreenshotData(context, latestScreenshotData);
    if (referenceScreenshotData) {
      const comparisonData = await TerraCompare.compareImages(referenceScreenshotData, latestScreenshotData, ignoreComparison);
      const { isSameDimensions } = comparisonData;
      const misMatchPercentage = Number(comparisonData.misMatchPercentage);
      const misMatchTolerance = get(context, 'options.misMatchTolerance', this.misMatchTolerance);
      const isMisMatchWithinTolerance = misMatchPercentage <= misMatchTolerance;

      if (!isMisMatchWithinTolerance) {
        const png = comparisonData.getDiffImage().pack();
        const diffImageData = await TerraCompare.createDiff(png);
        await this.screenshotProcessor.saveDiffFileData(context, diffImageData);
      }
      return this.createResultReport(misMatchPercentage, isMisMatchWithinTolerance, isSameDimensions);
    }
    return this.screenshotProcessor.handleNoReferenceScreenshot(context, latestScreenshotData, this.failInCIOnMissingReferenceShots, this.createResultReport);
  }

  static async compareImages(reference, screenshot, ignoreComparison) {
    return new Promise((resolve) => {
      const image = resemble(reference).compareTo(screenshot);
      switch (ignoreComparison) {
        case 'colors':
          image.ignoreColors();
          break;
        case 'antialiasing':
          image.ignoreAntialiasing();
          break;
        default:
          break;
      }
      image.onComplete((data) => {
        resolve(data);
      });
    });
  }

  static async createDiff(png) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      png.on('data', (chunk) => {
        chunks.push(chunk);
      });
      png.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      png.on('error', err => reject(err));
    });
  }

  static createResultReport(misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions) {
    return {
      misMatchPercentage,
      isWithinMisMatchTolerance,
      isSameDimensions,
      isExactSameImage: misMatchPercentage === 0,
    };
  }
}
