const fs = require('fs-extra');
const { Logger } = require('@cerner/terra-cli');
const BaseCompare = require('./BaseCompare');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const logger = new Logger({ prefix: '[wdio-visual-regression-service:SaveScreenshot]' });

class SaveScreenshot extends BaseCompare {
  constructor(options = {}) {
    super(options);
    this.getScreenshotPath = options.screenshotName;
  }

  async processScreenshot(context, base64Screenshot) {
    const screenshotPath = this.getScreenshotPath(context);
    console.log("screenshotPath ::: ", screenshotPath);
    eventEmitter.emit('terra-wdio:latest-screenshot', screenshotPath);
    logger.verbose(`create screenshot file at ${screenshotPath}`);
    await fs.outputFile(screenshotPath, base64Screenshot, 'base64');
    return this.createResultReport(false);
  }
}

module.exports = SaveScreenshot;
