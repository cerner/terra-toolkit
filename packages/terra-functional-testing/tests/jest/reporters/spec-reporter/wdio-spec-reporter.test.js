const fs = require('fs');
const SpecReporter = require('../../../../src/reporters/spec-reporter/wdio-spec-reporter');
const testData1 = require('../../../fixtures/reporters/test-data-1.json');

describe('Spec Reporter', () => {
  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  describe('onRunnerEnd', () => {
    it('should format and write test results to file when the runner ends', () => {
      jest.spyOn(SpecReporter, 'formatResults').mockImplementationOnce(() => 'mock-results');
      jest.spyOn(SpecReporter, 'writeResults').mockImplementationOnce(() => {});

      const reporter = new SpecReporter({});

      reporter.onRunnerEnd({});

      expect(SpecReporter.formatResults).toHaveBeenCalled();
      expect(SpecReporter.writeResults).toHaveBeenCalledWith({}, 'mock-results');
    });
  });

  describe('formatResults', () => {
    it('should format the suite results', () => {
      const mockRunner = { capabilities: {}, specs: ['/mock/spec'] };

      const results = SpecReporter.formatResults(testData1, mockRunner);

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

      const results = SpecReporter.formatTests(tests);

      expect(results).toMatchSnapshot();
    });
  });

  describe('getPackageName', () => {
    it('should return the correct package name for a spec nested in a monorepo', () => {
      const packageName = SpecReporter.getPackageName('/tmp/tmp/packages/terra-mock-package/tests/wdio/specs.js');

      expect(packageName).toEqual('terra-mock-package');
    });

    it('should return the correct package name for a spec file', () => {
      const packageName = SpecReporter.getPackageName('/terra-toolkit/tests/wdio/specs.js');

      expect(packageName).toEqual('terra-toolkit');
    });
  });

  describe('writeResults', () => {
    it('should write the test results to file', () => {
      const runner = {
        cid: '0-0',
        config: {
          reporterOptions: {
            outputDir: 'mock-dir',
          },
        },
      };

      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
      jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => {});
      jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => []);

      SpecReporter.writeResults(runner, 'mock-results');

      expect(fs.existsSync).toHaveBeenCalledWith('mock-dir');
      expect(fs.mkdirSync).toHaveBeenCalledWith('mock-dir', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith('mock-dir/wdio-spec-results-0-0.json', '"mock-results"');
    });
  });
});
