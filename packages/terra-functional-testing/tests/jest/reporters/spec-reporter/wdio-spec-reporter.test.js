const fs = require('fs-extra');
const path = require('path');
const SpecReporter = require('../../../../src/reporters/spec-reporter/wdio-spec-reporter');
const testData1 = require('../../../fixtures/reporters/test-data-1.json');
const { eventEmitter } = require('../../../../src/commands/utils');

jest.mock('../../../../src/reporters/spec-reporter/get-output-dir', () => (
  jest.fn().mockImplementation(() => ('/mock/'))
));

describe('Spec Reporter', () => {
  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize', () => {
      const reporter = new SpecReporter({ writeStream: {} });

      expect(reporter.screenshotPaths).toEqual([]);
      expect(reporter.screenshotMap).toEqual({});
    });

    it('should listen to latest-screenshot event', () => {
      const reporter = new SpecReporter({ writeStream: {} });

      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot.png');

      expect(reporter.screenshotPaths).toEqual(['path/screenshot.png']);
    });

    it('should not save duplicate screenshot paths', () => {
      const reporter = new SpecReporter({ writeStream: {} });

      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot.png');
      eventEmitter.emit('terra-functional-testing:capture-screenshott', 'path/screenshot.png');

      expect(reporter.screenshotPaths).toEqual(['path/screenshot.png']);
    });
  });

  describe('onTestEnd', () => {
    it('should save screenshot paths', () => {
      const reporter = new SpecReporter({ writeStream: {} });

      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot.png');

      const testOption = { uid: 'test-10-0' };

      reporter.onTestEnd(testOption);

      expect(reporter.screenshotMap).toEqual({ 'test-10-0': ['path/screenshot.png'] });
      expect(reporter.screenshotPaths).toEqual([]);
    });
  });

  describe('onRunnerEnd', () => {
    it('should format and write test results to file when the runner ends', () => {
      const reporter = new SpecReporter({ writeStream: {} });

      jest.spyOn(reporter, 'formatResults').mockImplementationOnce(() => 'mock-results');
      jest.spyOn(SpecReporter, 'writeResults').mockImplementationOnce(() => {});

      reporter.onRunnerEnd({});

      expect(reporter.formatResults).toHaveBeenCalled();
      expect(SpecReporter.writeResults).toHaveBeenCalledWith({}, 'mock-results');
    });
  });

  describe('formatResults', () => {
    it('should format the suite results', () => {
      const mockRunner = { capabilities: {}, specs: ['/mock/spec'] };

      const reporter = new SpecReporter({ writeStream: {} });

      const results = reporter.formatResults(testData1, mockRunner);

      expect(results).toMatchSnapshot();
    });
  });

  describe('formatCapabilities', () => {
    it('should format the browser capabilities', () => {
      const mockCapabilities = { browserName: 'chrome', version: '1.0.0', platform: 'linux' };

      const capabilities = SpecReporter.formatCapabilities(mockCapabilities);

      expect(capabilities).toEqual(mockCapabilities);
    });
  });

  describe('formatTests', () => {
    it('should format the test results', () => {
      const { tests } = testData1.suites[0].suites[0];
      const reporter = new SpecReporter({ writeStream: {} });

      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot1.png');
      reporter.onTestEnd(tests[0]);
      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot2.png');
      reporter.onTestEnd(tests[1]);
      eventEmitter.emit('terra-functional-testing:capture-screenshot', 'path/screenshot3.png');
      reporter.onTestEnd(tests[2]);

      const results = reporter.formatTests(tests);

      expect(results).toMatchSnapshot();
    });
  });

  describe('getPackageName', () => {
    it('should return the correct package name for a spec nested in a monorepo', () => {
      const packageName = SpecReporter.getPackageName('/tmp/tmp/packages/terra-mock-package/tests/wdio/specs.js');

      expect(packageName).toEqual('terra-mock-package');
    });

    it('should return the correct package name for a spec file', () => {
      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
      const jsonreturn = {
        name: 'terra-test',
      };
      jest.spyOn(fs, 'readJsonSync').mockImplementationOnce(() => jsonreturn);

      const packageName = SpecReporter.getPackageName('/terra-toolkit/tests/wdio/specs.js');

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readJsonSync).toHaveBeenCalledWith(path.join(process.cwd(), 'package.json'));
      expect(packageName).toEqual('terra-test');
    });

    it('should return the running directories name if it can not find package.json', () => {
      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);

      const packageName = SpecReporter.getPackageName('/terra-toolkit/tests/wdio/specs.js');

      expect(fs.existsSync).toHaveBeenCalled();
      expect(packageName).toEqual('terra-toolkit');
    });
  });

  describe('writeResults', () => {
    it('should write the test results to file', () => {
      const runner = { cid: '0-0' };

      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
      jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => {});
      jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => []);

      SpecReporter.writeResults(runner, 'mock-results');

      expect(fs.existsSync).toHaveBeenCalledWith('/mock/');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/mock/', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith('/mock/wdio-spec-results-0-0.json', '"mock-results"');
    });
  });
});
