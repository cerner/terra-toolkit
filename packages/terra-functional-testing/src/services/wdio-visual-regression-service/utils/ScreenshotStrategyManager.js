import { Logger } from '@cerner/terra-cli';

import MergeViewportStrategy from './strategies/MergeScreenshotStrategy';
import TrimAndMergeViewportStrategy from './strategies/TrimAndMergeScreenshotStrategy';

const logger = new Logger('[wdio-visual-regression-service:ScreenshotStrategyManager]');

export default class ScreenshotStrategyManager {
  static getStrategy(browser, screenDimensions) {
    const { isIOS } = browser;
    if (isIOS) {
      logger.verbose('use iOS Trim and Merge viewport strategy');
      return new TrimAndMergeViewportStrategy(screenDimensions);
    }

    logger.verbose('use merge viewport strategy');
    return new MergeViewportStrategy(screenDimensions);
  }
}
