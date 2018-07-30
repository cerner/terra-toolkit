const path = require('path');
const { LocalCompare } = require('wdio-visual-regression-service/compare');
const { terraViewports: VIEWPORTS } = require('./services.default-config');

const screenshotSetup = {
  diffDir: 'diff',
  referenceDir: 'reference',
  screenshotDir: 'latest',
};

const testIdRegex = /\[([^)]+)\]/;

function createTestName(fullName) {
  const matches = testIdRegex.exec(fullName);

  // If test ID is provided, use the ID for a shorter test name, otherwise use the full name
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
    const viewportSizes = Object.keys(VIEWPORTS);
    for (let i = 0; i < viewportSizes.length; i += 1) {
      const viewport = viewportSizes[i];
      if (browserWidth <= VIEWPORTS[viewport].width) {
        formFactor = VIEWPORTS[viewport].name;
        break;
      }
    }
  }

  // If viewport value is undefined due to being larger then the terra defiend viewports, set formFactor to enormous.
  formFactor = formFactor || 'enormous';

  return formFactor;
}

function getScreenshotDir(context) {
  const locale = global.browser.options.locale || 'en';
  const browserName = context.desiredCapabilities.browserName;
  const formFactor = getFormFactor(context);
  const testForm = `${browserName}_${formFactor}`;
  const testSuite = path.parse(context.test.file).name;

  return path.join(locale, testForm, testSuite);
}

function getScreenshotPath(ref) {
  return (context) => {
    let testPath = path.dirname(context.test.file);

    const baseDir = global.browser.options.baseScreenshotDir;
    if (baseDir) {
      testPath = testPath.split(process.cwd())[1];
      // Added to allow for test reusablility from terra repositories
      if (testPath.includes('node_modules')) {
        testPath = testPath.split('node_modules')[1];
      }
      testPath = baseDir + testPath;
    }
    const refDir = screenshotSetup[`${ref}Dir`];

    return path.join(testPath, '__snapshots__', refDir, getScreenshotDir(context), getScreenshotName(context));
  };
}

module.exports = {
  compare: new LocalCompare({
    referenceName: getScreenshotPath('reference'),
    screenshotName: getScreenshotPath('screenshot'),
    diffName: getScreenshotPath('diff'),
    misMatchTolerance: 0.01,
  }),
  viewportChangePause: 100,
};
