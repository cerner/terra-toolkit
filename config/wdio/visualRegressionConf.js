const path = require('path');
const LocalCompare = require('wdio-visual-regression-service/compare').LocalCompare;
const viewports = require('./services.default-config').terraViewports;

const testIdRegex = /\[([^)]+)\]/;

const screenshotSetup = {
  diffDir: 'diff',
  referenceDir: 'reference',
  screenshotDir: 'latest',
};

function createTestName(fullName) {
  const matches = testIdRegex.exec(fullName);

  let name = matches ? matches[1] : fullName.trim();

  // Remove white space
  name = name.replace(/[\s+.]/g, '_');

  // Remove windows reserved characters. See: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#naming_conventions
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\?\<\>\/\\|\*\"\:\+\.]/g, '-');

  return name;
}

function getScreenshotName(context) {
  const parentName = createTestName(context.test.parent);
  const testName = createTestName(context.test.title);

  return `${parentName}[${testName}].png`;
}

function getFormFactor(context) {
  let formFactor = global.browser.options.formFactor;

  if (!formFactor) {
    const browserWidth = context.meta.viewport.width;
    const viewportSizes = Object.keys(viewports);
    for (let i = 0; i < viewportSizes.length; i += 1) {
      const viewport = viewportSizes[i];
      if (browserWidth <= viewports[viewport].width) {
        formFactor = viewports[viewport].name;
        break;
      }
    }
  }

  return formFactor;
}

function getScreenshotPath(ref, context) {
  const refDir = screenshotSetup[`${ref}Dir`];
  const locale = global.browser.options.locale || 'en';
  const browserName = context.desiredCapabilities.browserName;
  const formFactor = getFormFactor(context);
  const testForm = `${browserName}_${formFactor}`;
  const testSuite = path.parse(context.test.file).name;

  return path.join(refDir, locale, testForm, testSuite);
}

function getScreenshot(ref) {
  return (context) => {
    let testPath = path.dirname(context.test.file);

    const baseDir = global.browser.options.baseScreenshotDir;
    if (baseDir) {
      testPath = baseDir + testPath.split(process.cwd())[1];
    }

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
