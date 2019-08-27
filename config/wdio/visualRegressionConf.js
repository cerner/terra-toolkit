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
  const { name } = (context.options || {});
  const parentName = createTestName(context.test.parent);
  const testName = createTestName(name || context.test.title);

  return `${parentName}[${testName}].png`;
}

function getFormFactor(context) {
  const browserWidth = context.meta.viewport.width;

  // Default to enormous then check if the current viewport is a small form factor
  let formFactor = 'enormous';

  const viewportSizes = Object.keys(VIEWPORTS);
  for (let form = 0; form < viewportSizes.length; form += 1) {
    const viewport = viewportSizes[form];
    if (browserWidth <= VIEWPORTS[viewport].width) {
      formFactor = VIEWPORTS[viewport].name;
      break;
    }
  }

  return formFactor;
}

function getScreenshotDir(context) {
  const locale = global.browser.options.locale || 'en';
  const { browserName } = context.desiredCapabilities;
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
      [, testPath] = testPath.split(process.cwd());
      // Added to allow for test reusablility from terra repositories
      if (testPath.includes('node_modules')) {
        [, testPath] = testPath.split('node_modules');
      }
      testPath = baseDir + testPath;
    }
    const refDir = screenshotSetup[`${ref}Dir`];

    const { theme } = global.browser.options;
    return path.join(testPath, '__snapshots__', refDir, theme || '', getScreenshotDir(context), getScreenshotName(context));
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
