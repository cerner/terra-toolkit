import path from 'path';
import { LocalCompare } from 'wdio-visual-regression-service/compare';

function getScreenshotName(ref) {
  return (context) => {
    const testName = context.test.title;
    const browserName = context.desiredCapabilities.browserName;
    const browserWidth = context.meta.viewport.width;
    const testPath = path.dirname(context.test.file);
    return path.join(testPath, '__snapshots__', ref, `${testName}_${browserName}_${browserWidth}.png`);
  };
}

module.exports = {
  compare: new LocalCompare({
    referenceName: getScreenshotName('reference'),
    screenshotName: getScreenshotName('screen'),
    diffName: getScreenshotName('diff'),
    misMatchTolerance: 0.01,
  }),
  viewportChangePause: 100,
  widths: [],
};
