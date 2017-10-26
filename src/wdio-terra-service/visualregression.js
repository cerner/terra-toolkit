const path = require('path');
import VisualRegressionCompare from 'wdio-visual-regression-service/compare';

function getScreenshotName(ref) {
  return (context) => {
    const testName = context.test.title;
    const browserName = context.desiredCapabilities.browserName;
    const browserWidth = context.meta.viewport.width;
    const testPath = path.dirname(context.test.file);
    return path.join(testPath, '__snapshots__', ref, `${testName}_${browserName}_${browserWidth}.png`);
  };
}

export default {
  compare: new VisualRegressionCompare.LocalCompare({
    referenceName: getScreenshotName('reference'),
    screenshotName: getScreenshotName('screen'),
    diffName: getScreenshotName('diff'),
    misMatchTolerance: 0.01,
  }),
  viewportChangePause: 300,
  widths: [],
};

export { getScreenshotName };
