import path from 'path';
import { LocalCompare } from 'wdio-visual-regression-service/compare';

const testIdRegex = /\[([^)]+)\]/;

const screenshotSetup = {
  diffDir: 'diff',
  referenceDir: 'reference',
  screenshotDir: 'latest',
};

function createTestName(fullName) {
  const matches = testIdRegex.exec(fullName);
  let name = fullName.trim().replace(/[\s+.]/g, '_');
  if (matches) {
    name = matches[1];
  }

  return name;
}

function getScreenshotName(context) {
  const browserWidth = context.meta.viewport.width;
  const browserHeight = context.meta.viewport.height;
  const parentName = createTestName(context.test.parent);
  const testName = createTestName(context.test.title);

  return `${parentName}[${testName}].${browserWidth}x${browserHeight}.png`;
}

function getScreenshotPath(ref, context) {
  const refDir = screenshotSetup[`${ref}Dir`];
  const locale = 'en';
  const browserName = context.desiredCapabilities.browserName;
  const testSuite = path.parse(context.test.file).name;

  return path.join(refDir, locale, browserName, testSuite);
}

function getScreenshot(ref) {
  return (context) => {
    const testPath = path.dirname(context.test.file);
    return path.join(testPath, '__snapshots__', getScreenshotPath(ref, context), getScreenshotName(context));
  };
}

module.exports = {
  compare: new LocalCompare({
    referenceName: getScreenshot('reference'),
    screenshotName: getScreenshot('screenshot'),
    diffName: getScreenshot('diff'),
    misMatchTolerance: 0.01,
  }),
  viewportChangePause: 100,
};
