import BaseCompare from 'wdio-visual-regression-service/lib/methods/BaseCompare';
import resemble from 'node-resemble-js';
import get from 'lodash.get';

export default class TerraCompare extends BaseCompare {
  constructor(config) {
    super();
    this.screenshotProcessor = config.screenshotProcessor;
    this.failInCIOnMissingReferenceShots = config.failInCIOnMissingReferenceShots;
  }

  async processScreenshot(context, base64Screenshot) {
    const referenceScreenshotData = await this.screenshotProcessor.getReferenceScreenshotData(context);
    const latestScreenshotData = Buffer.from(base64Screenshot, 'base64');
    const pendingAsyncMethods = [async () => this.screenshotProcessor.saveLatestScreenshotData(context, latestScreenshotData)];
    if (referenceScreenshotData) {
      const comparisonData = await TerraCompare.compareImages(referenceScreenshotData, latestScreenshotData);
      const { isSameDimensions } = comparisonData;
      const misMatchPercentage = Number(comparisonData.misMatchPercentage);
      const misMatchTolerance = get(context, 'options.misMatchTolerance', 0.01);

      if (misMatchPercentage > misMatchTolerance) {
        const png = comparisonData.getDiffImage().pack();
        const diffImageData = await TerraCompare.createDiff(png);
        pendingAsyncMethods.push(async () => this.screenshotProcessor.saveDiffFileData(context, diffImageData));
        await Promise.all(pendingAsyncMethods);

        return this.createResultReport(misMatchPercentage, false, isSameDimensions);
      }
      return this.createResultReport(misMatchPercentage, true, isSameDimensions);
    }
    pendingAsyncMethods.push(async () => this.screenshotProcessor.handleNoReferenceScreenshot(context, latestScreenshotData, this.failInCIOnMissingReferenceShots, this.createResultReport));
    return (await Promise.all(pendingAsyncMethods))[pendingAsyncMethods.length - 1];
  }

  static async compareImages(reference, screenshot) {
    return new Promise((resolve) => {
      const image = resemble(reference).compareTo(screenshot);
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
}
