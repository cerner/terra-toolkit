import path from 'path';
import { LocalCompare } from 'wdio-visual-regression-service/compare';

const testIdRegex = /\[([^)]+)\]/;

function testName(parent, title) {
  const matches = testIdRegex.exec(title);
  const parentName = parent.replace(/[\s+.]/g, '_');
  let name = title.trim().replace(/[\s+.]/g, '_');
  if (matches) {
    name = matches[1];
  }

  return `${parentName}[${name}]`;
}

function getScreenshotName(ref) {
  return (context) => {
    const browserName = context.desiredCapabilities.browserName;
    const browserWidth = context.meta.viewport.width;
    const browserHeight = context.meta.viewport.height;
    const testPath = path.dirname(context.test.file);
    const name = testName(context.test.parent, context.test.title);
    return path.join(testPath, '__snapshots__', ref, browserName, `${name}.${browserWidth}x${browserHeight}.png`);
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
