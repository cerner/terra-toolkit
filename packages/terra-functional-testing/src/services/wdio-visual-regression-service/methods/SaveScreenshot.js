import fs from 'fs-extra';
import logger from '@wdio/logger';
import BaseCompare from './BaseCompare';

const log = logger('wdio-visual-regression-service:SaveScreenshot');

export default class SaveScreenshot extends BaseCompare {
  constructor(options = {}) {
    super();
    this.getScreenshotFile = options.screenshotName;
  }

  async processScreenshot(context, base64Screenshot) {
    const screenshotPath = this.getScreenshotFile(context);

    log.info(`create screenshot file at ${screenshotPath}`);
    await fs.outputFile(screenshotPath, base64Screenshot, 'base64');
    return this.createResultReport(0, true, true);
  }
}
