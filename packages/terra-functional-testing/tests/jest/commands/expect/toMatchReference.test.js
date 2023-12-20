const path = require('path');
const fs = require('fs-extra');
const mockInfo = jest.fn();
jest.mock('@cerner/terra-cli/lib/utils/Logger', () => function mock() {
  return {
    info: mockInfo,
  };
});
jest.mock('../../../../src/reporters/spec-reporter/get-output-dir', () => (
  jest.fn().mockImplementation(() => ('/mock/'))
));

const toMatchReference = require('../../../../src/commands/expect/toMatchReference');
const { BUILD_BRANCH, BUILD_TYPE } = require('../../../../src/constants');

describe('toMatchReference', () => {
  beforeAll(() => {
    mockInfo.mockClear();
    jest.resetModules();
    global.Terra = {
      serviceOptions: {
        ignoreScreenshotMismatch: false,
      },
    };
  });

  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  it('should pass if matches reference screenshot', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should pass for new screenshot', () => {
    const receivedScreenshot = {
      isNewScreenshot: true,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should pass if screenshot was auto updated even when mismatch and not same dimension', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: false,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.50,
      screenshotWasUpdated: true,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should pass if not within mismatch tolerance but ignoreScreenshotMistmatch is true', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    global.Terra = {
      serviceOptions: {
        ignoreScreenshotMismatch: true,
      },
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);

    global.Terra = {
      serviceOptions: {
        ignoreScreenshotMismatch: false,
      },
    };
  });

  it('should not pass if not within mismatch tolerance', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should not pass if not same dimension', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: false,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should return a message function that indicates the reason for the assertion failure', () => {
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);

    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.message()).toEqual(expectedMessage);
  });

  it('should pass if matches reference screenshot and buildBranch is master', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
      },
    };
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should not pass if not within mismatch tolerance and buildBranch is master', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
      },
    };
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should pass if matches reference screenshot and buildBranch is dev', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.dev,
      },
    };
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should not pass if not within mismatch tolerance and buildBranch is dev', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.dev,
      },
    };
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should pass if matches reference screenshot and buildBranch matches pullRequest', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: 'pr-31',
      },
    };
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
      screenshotWasUpdated: false,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should not pass if not within mismatch tolerance, buildBranch matches pullRequest, and useRemoteReferenceScreenshots is false', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: 'pr-31',
        useRemoteReferenceScreenshots: false,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.pass).toBe(false);
    expect(result.message()).toEqual(expectedMessage);
  });

  it('should pass if not within mismatch tolerance but buildBranch matches pullRequest and useRemoteReferenceScreenshots is true', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: 'pr-31',
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);

    const result = toMatchReference(receivedScreenshot, 'TestName');
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.pass).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(result.message()).toEqual(expectedMessage);
    expect(mockInfo).toHaveBeenCalledWith('Test: \'TestName\' has a mismatch difference of 0.1% and needs to be reviewed.');
  });

  it('should not pass if not within mismatch tolerance, buildBranch matches master, useRemoteReferenceScreenshots is true and buildType is not defined', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.pass).toBe(false);
    expect(result.message()).toEqual(expectedMessage);
  });

  it('should pass if not within mismatch tolerance, buildBranch matches dev, useRemoteReferenceScreenshots is true and buildType is branchEventCause', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.dev,
        buildType: BUILD_TYPE.branchEventCause,
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);

    const result = toMatchReference(receivedScreenshot, 'TestName');
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.pass).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(result.message()).toEqual(expectedMessage);
    expect(mockInfo).toHaveBeenCalledWith('Test: \'TestName\' has a mismatch difference of 0.1% and needs to be reviewed.');
  });

  it('should pass if not within mismatch tolerance but buildBranch matches master, useRemoteReferenceScreenshots is true, and buildType is branchEventCause', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
        buildType: BUILD_TYPE.branchEventCause,
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);

    const result = toMatchReference(receivedScreenshot, 'TestName');
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';
    
    expect(result.pass).toBe(true);
    expect(result.message()).toEqual(expectedMessage);
    expect(mockInfo).toHaveBeenCalledWith('Test: \'TestName\' has a mismatch difference of 0.1% and needs to be reviewed.');
  });

  it('should create the output directory and ignored-mismatch file if useRemoteReferenceScreenshots is true, a mismatch happened, and it is a pull request', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
        buildType: BUILD_TYPE.branchEventCause,
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => false);

    const result = toMatchReference(receivedScreenshot, 'TestName');
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';
    
    expect(result.pass).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledWith('/mock/', { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(path.join('/mock/', 'ignored-mismatch.json'), JSON.stringify({ screenshotMismatched: true }, null, 2));
    expect(result.message()).toEqual(expectedMessage);
    expect(mockInfo).toHaveBeenCalledWith('Test: \'TestName\' has a mismatch difference of 0.1% and needs to be reviewed.');
  });

  it('should just create the ignored-mismatch file if output directory already exists but file does not', () => {
    global.Terra = {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
        buildType: BUILD_TYPE.branchEventCause,
        useRemoteReferenceScreenshots: true,
      },
    };
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };
    jest.spyOn(fs, 'existsSync').mockImplementation((pathName) => (pathName === '/mock/') ? true : false);
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => false);

    const result = toMatchReference(receivedScreenshot, 'TestName');
    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';
    
    expect(result.pass).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(fs.existsSync.mock.calls).toEqual([
      ['/mock/'], // First call
      [path.join('/mock/', 'ignored-mismatch.json')]  // Second call
    ])
    expect(fs.writeFileSync).toHaveBeenCalledWith(path.join('/mock/', 'ignored-mismatch.json'), JSON.stringify({ screenshotMismatched: true }, null, 2));
    expect(result.message()).toEqual(expectedMessage);
    expect(mockInfo).toHaveBeenCalledWith('Test: \'TestName\' has a mismatch difference of 0.1% and needs to be reviewed.');
  });
});
