const AccessibilityReporter = require('../../../../src/reporters/accessibility-reporter/wdio-accessibility-reporter');
const testData1 = require('../../../fixtures/reporters/test-data-1.json');

jest.mock('chalk', () => ({
  yellow: (string) => string,
}));

describe('Accessibility Reporter', () => {
  describe('indent', () => {
    it('should indent a string', () => {
      expect(AccessibilityReporter.indent('Mock string', 3)).toEqual('   Mock string');
    });

    it('should return the same string if intent is zero', () => {
      const string = 'Mock string';

      expect(AccessibilityReporter.indent(string, 0)).toEqual(string);
    });
  });

  describe('constructor', () => {
    it('should initialize an accessibility reporter', () => {
      jest.spyOn(process, 'on');

      const reporter = new AccessibilityReporter({ writeStream: {} });

      expect(reporter).toBeDefined();
      expect(process.on).toHaveBeenCalledWith('terra:report:accessibility', expect.any(Function));
    });
  });

  describe('onTestStart', () => {
    it('should track the current test id', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      reporter.onTestStart({ uid: 'mock' });

      expect(reporter.currentTest).toEqual('mock');
    });
  });

  describe('onReportAccessibility', () => {
    it('should track the accessibility results', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      reporter.onTestStart({ uid: 'mock' });
      reporter.onReportAccessibility({ warnings: [] });

      expect(reporter.accessibilityResults.mock).toEqual({ warnings: [] });
    });
  });

  describe('onRunnerEnd', () => {
    it('should print the test results', () => {
      const mockRunner = jest.fn();
      const reporter = new AccessibilityReporter({ writeStream: {} });

      jest.spyOn(reporter, 'printReport').mockImplementationOnce(() => {});

      reporter.onRunnerEnd(mockRunner);

      expect(reporter.printReport).toHaveBeenCalledWith(mockRunner);
    });
  });

  describe('printReport', () => {
    it('should not print an accessibility report if there are no violations', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      jest.spyOn(reporter, 'write').mockImplementationOnce(() => {});

      reporter.printReport();

      expect(reporter.write).not.toHaveBeenCalled();
    });

    it('should print an accessibility report', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      reporter.accessibilityResults = { 'test-id': { warnings: [] } };

      jest.spyOn(reporter, 'travelSuite').mockImplementationOnce(() => ('mock output'));
      jest.spyOn(reporter, 'write').mockImplementationOnce(() => {});

      const mockRunner = { specs: ['/mock/spec/file'] };

      reporter.printReport(mockRunner);

      expect(reporter.write).toHaveBeenCalledWith('Spec: /mock/spec/file\nmock output');
    });
  });

  describe('travelSuite', () => {
    it('should travel a nested suite tree and generate an accessibility report', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      reporter.accessibilityResults = {
        'test-10-0': {},
        'test-10-1': {},
        'test-10-2': {},
      };

      jest.spyOn(reporter, 'formatTestWarning').mockImplementation(() => ('warning - mock test title'));

      const report = reporter.travelSuite(testData1);

      const expected = '\n  Example Describe 1\n    Example Describe 2\nwarning - mock test title\nwarning - mock test title\nwarning - mock test title\n\n\n';

      expect(report).toEqual(expected);
    });

    it('should return an empty string if there are no accessibility warnings', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      const report = reporter.travelSuite(testData1);

      expect(report).toEqual('');
    });
  });

  describe('formatTestWarning', () => {
    it('should format the test warning', () => {
      const reporter = new AccessibilityReporter({ writeStream: {} });

      reporter.tests = {
        'test-10-0': {
          title: 'mock title',
        },
      };

      reporter.accessibilityResults = {
        'test-10-0': {
          warnings: ['mock warning'],
        },
      };

      expect(reporter.formatTestWarning('test-10-0', 2)).toEqual('  warning mock title\n\n   [\n    "mock warning"\n  ]');
    });
  });
});
