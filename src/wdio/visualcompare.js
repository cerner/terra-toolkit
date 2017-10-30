import path from 'path';
import { LocalCompare } from 'wdio-visual-regression-service/compare';

const testIdRegex = /^\[([^)]+)\]/;

function testName(name) {
  const matches = testIdRegex.exec(name);
  if (matches) {
    return matches[1];
  }

  return name.replace(/[\s+.]/g, '_');
}

function getScreenshotName(ref) {
  return (context) => {
    const test = context.test.title;
    const browserName = context.desiredCapabilities.browserName;
    const browserWidth = context.meta.viewport.width;
    const browserHeight = context.meta.viewport.height;
    const testPath = path.dirname(context.test.file);
    return path.join(testPath, '__snapshots__', ref, browserName, `${testName(test)}.${browserWidth}x${browserHeight}.png`);
  };
}

module.exports = {
  compare: new LocalCompare({
    referenceName: getScreenshotName('reference'),
    screenshotName: getScreenshotName('screen'),
    diffName: getScreenshotName('diff'),
    misMatchTolerance: 0.01,
  }),
  viewportChangePause: 50,
  widths: [],
};
