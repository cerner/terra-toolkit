const { assert } = require('chai');

const ScreenshotStrategyManager = require('../../../../../../src/services/wdio-visual-regression-service/utils/ScreenshotStrategyManager');
const BaseStrategy = require('../../../../../../src/services/wdio-visual-regression-service/utils/strategies/BaseStrategy');
const MergeScreenshotStrategy = require('../../../../../../src/services/wdio-visual-regression-service/utils/strategies/MergeScreenshotStrategy');
const { TrimAndMergeScreenshotStrategy } = require('../../../../../../src/services/wdio-visual-regression-service/utils/strategies/TrimAndMergeScreenshotStrategy');
const ScreenDimension = require('../../../../../../src/services/wdio-visual-regression-service/utils/ScreenDimension');

const dimensionScrollBoth = require('../../../../../fixtures/dimension/desktop-scroll-both.json');
const dimensionIpad92PortraitZoomed = require('../../../../../fixtures/dimension/iOS_iPad_Air_9_2_portrait_zoomed.json');

describe('ScreenshotStrategyManager', function() {
  before(function() {
    const browser = {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
    };

    this.firefox = {
      ...browser,
      desiredCapabilities: {
        browserName: 'firefox',
      },
    };

    this.firefox2 = {
      ...browser,
      desiredCapabilities: {
        browserName: 'mozilla firefox',
      },
    };

    this.chrome = {
      ...browser,
      desiredCapabilities: {
        browserName: 'chrome',
      },
    };

    this.chrome2 = {
      ...browser,
      desiredCapabilities: {
        browserName: 'google chrome',
      },
    };

    this.ie = {
      ...browser,
      desiredCapabilities: {
        browserName: 'ie',
      },
    };

    this.ie2 = {
      ...browser,
      desiredCapabilities: {
        browserName: 'internet explorer',
      },
    };

    this.ipad = {
      ...browser,
      isMobile: true,
      isIOS: true,
      desiredCapabilities: {
        browserName: 'safari',
        deviceName: 'iPad',
      },
    };

    this.screenDimensions = new ScreenDimension(dimensionScrollBoth);
    this.screenDimensionsIpadScaled = new ScreenDimension(dimensionIpad92PortraitZoomed);
  });

  it('returns a instance of MergeScreenshotStrategy for browsers with support for viewport screenshots only', function() {
    const browsers = [this.firefox, this.firefox2, this.chrome, this.chrome2, this.ie, this.ie2];

    // eslint-disable-next-line no-restricted-syntax
    for (const browser of browsers) {
      // when
      const strategy = ScreenshotStrategyManager.getStrategy(browser, this.screenDimensions);
      // then
      assert.instanceOf(strategy, BaseStrategy);
      assert.instanceOf(strategy, MergeScreenshotStrategy);
    }
  });

  it('returns a instance of TrimAndMergeScreenshotStrategy for iOS devices', function() {
    const browsers = [this.ipad];

    // eslint-disable-next-line no-restricted-syntax
    for (const browser of browsers) {
      // when
      const strategy = ScreenshotStrategyManager.getStrategy(browser, this.screenDimensions);
      // then
      assert.instanceOf(strategy, BaseStrategy);
      assert.instanceOf(strategy, TrimAndMergeScreenshotStrategy);
    }
  });
});
