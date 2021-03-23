const { Logger } = require('@cerner/terra-cli');

const MergeViewportStrategy = require('./strategies/MergeScreenshotStrategy');
const { TrimAndMergeScreenshotStrategy } = require('./strategies/TrimAndMergeScreenshotStrategy');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:ScreenshotStrategyManager]' });

class ScreenshotStrategyManager {
  static getStrategy(browser, screenDimensions) {
    const { isIOS } = browser;
    if (isIOS) {
      logger.verbose('use iOS Trim and Merge viewport strategy');
      return new TrimAndMergeScreenshotStrategy(screenDimensions);
    }

    logger.verbose('use merge viewport strategy');
    return new MergeViewportStrategy(screenDimensions);
  }
}

module.exports = ScreenshotStrategyManager;
