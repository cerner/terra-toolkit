import path from 'path';
import fs from 'fs-extra';
import TerraCompare from './TerraCompare';
import { terraViewports as VIEWPORTS } from '../../../../config/wdio/services.default-config';

const screenshotSetup = {
  diffDir: 'diff',
  referenceDir: 'reference',
  screenshotDir: 'latest',
};

const testIdRegex = /\[([^)]+)\]/;

export default class LocalScreenshotProcessor extends TerraCompare {
  static createTestName(fullName) {
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

  static getScreenshotName(context) {
    const parentName = LocalScreenshotProcessor.createTestName(context.test.parent);
    const testName = LocalScreenshotProcessor.createTestName(context.test.title);

    return `${parentName}[${testName}].png`;
  }

  static getFormFactor(context) {
    let formFactor = global.browser.options.formFactor;

    if (!formFactor) {
      const browserWidth = context.meta.viewport.width;
      const viewportSizes = Object.keys(VIEWPORTS);
      viewportSizes.some((viewport) => {
        if (browserWidth <= VIEWPORTS[viewport].width) {
          formFactor = VIEWPORTS[viewport].name;
          return true;
        }
        return false;
      });
    }

    // If viewport value is undefined due to being larger then the terra defiend viewports, set formFactor to enormous.
    formFactor = formFactor || 'enormous';

    return formFactor;
  }

  static getScreenshotDir(context) {
    const locale = global.browser.options.locale || 'en';
    const browserName = context.desiredCapabilities.browserName;
    const formFactor = LocalScreenshotProcessor.getFormFactor(context);
    const testForm = `${browserName}_${formFactor}`;
    const testSuite = path.parse(context.test.file).name;

    return path.join(locale, testForm, testSuite);
  }

  static getScreenshotPath(ref, context) {
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

    return path.join(testPath, '__snapshots__', refDir, LocalScreenshotProcessor.getScreenshotDir(context), LocalScreenshotProcessor.getScreenshotName(context));
  }

  static async getReferenceScreenshotData(context) {
    const referenceScreenshotPath = LocalScreenshotProcessor.getScreenshotPath('reference', context);
    return fs.readFile(referenceScreenshotPath);
  }

  static async saveLatestScreenshotData(context, latestScreenshotData) {
    const latestScreenshotPath = LocalScreenshotProcessor.getScreenshotPath('screenshot', context);
    await fs.outputFile(latestScreenshotPath, latestScreenshotData);
  }

  static async saveDiffFileData(context, diffData) {
    const diffScreenshotPath = LocalScreenshotProcessor.getScreenshotPath('diff', context);
    await fs.outputFile(diffScreenshotPath, diffData);
  }

  static async handleNoReferenceScreenshot(context, latestScreenshotData, failInCIOnMissingReferenceShots, createResultReport) {
    const referenceScreenshotPath = LocalScreenshotProcessor.getScreenshotPath('reference', context);
    await fs.outputFile(referenceScreenshotPath, latestScreenshotData);
    return createResultReport(0, !(failInCIOnMissingReferenceShots && process.env.CI), true);
  }
}
