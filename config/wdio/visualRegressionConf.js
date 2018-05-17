const path = require('path');
const LocalCompare = require('wdio-visual-regression-service/compare').LocalCompare;

const testIdRegex = /\[([^)]+)\]/;

const screenshotSetup = {
  diffDir: 'diff',
  referenceDir: 'reference',
  screenshotDir: 'latest',
};

const viewports = {
  tiny: { width: 470, height: 768, name: 'tiny' },
  small: { width: 622, height: 768, name: 'small' },
  medium: { width: 838, height: 768, name: 'medium' },
  large: { width: 1000, height: 768, name: 'large' },
  huge: { width: 1300, height: 768, name: 'huge' },
  enormous: { width: 1500, height: 768, name: 'enormous' },
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
  const locale = global.browser.options.locale;
  const browserName = context.desiredCapabilities.browserName;
  const formFactor = getFormFactor(context);
  const testForm = `${browserName}_${formFactor}`;
  const testSuite = path.parse(context.test.file).name;

  return path.join(refDir, locale, testForm, testSuite);
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
