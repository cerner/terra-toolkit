import fs from 'fs-extra';
import { Logger } from '@cerner/terra-cli';
import BaseCompare from './BaseCompare';

const logger = new Logger('[wdio-visual-regression-service:SaveScreenshot]');

export default class SaveScreenshot extends BaseCompare {
  constructor(options = {}) {
    super(options);
    this.getScreenshotPath = options.screenshotName;
  }

  async processScreenshot(context, base64Screenshot) {
    const screenshotPath = this.getScreenshotPath(context);

    logger.verbose(`create screenshot file at ${screenshotPath}`);
    await fs.outputFile(screenshotPath, base64Screenshot, 'base64');
    return this.createResultReport(false);
  }
}
