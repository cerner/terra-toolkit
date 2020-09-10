import logger from '@wdio/logger';

import MergeViewportStrategy from './strategies/MergeScreenshotStrategy';
import TrimAndMergeViewportStrategy from './strategies/TrimAndMergeScreenshotStrategy';

const log = logger('wdio-visual-regression-service:ScreenshotStrategyManager');

export default class ScreenshotStrategyManager {
  static getStrategy(browser, screenDimensions) {
    const { isIOS } = browser;
    if (isIOS) {
      log.info('use iOS Trim and Merge viewport strategy');
      return new TrimAndMergeViewportStrategy(screenDimensions);
    }

    log.info('use merge viewport strategy');
    return new MergeViewportStrategy(screenDimensions);
  }
}
