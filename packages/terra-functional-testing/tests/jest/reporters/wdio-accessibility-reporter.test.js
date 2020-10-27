import AccessibilityReporter from '../../../src/reporters/wdio-accessibility-reporter';

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

      const reporter = new AccessibilityReporter({});

      expect(reporter).toBeDefined();
      expect(process.on).toHaveBeenCalledWith('terra:report:accessibility', expect.any(Function));
    });
  });

  describe('onTestStart', () => {
    it('should track the current test id', () => {
      const reporter = new AccessibilityReporter({});

      reporter.onTestStart({ uid: 'mock' });

      expect(reporter.currentTest).toEqual('mock');
    });
  });

  describe('onReportAccessibility', () => {
    it('should track the accessibility results', () => {
      const reporter = new AccessibilityReporter({});

      reporter.onTestStart({ uid: 'mock' });
      reporter.onReportAccessibility({ incomplete: [] });

      expect(reporter.accessibilityResults.mock).toEqual({ incomplete: [] });
    });
  });

  describe('onRunnerEnd', () => {
    it('should print the test results', () => {
      const mockRunner = jest.fn();
      const reporter = new AccessibilityReporter({});

      jest.spyOn(reporter, 'printReport').mockImplementationOnce(() => {});

      reporter.onRunnerEnd(mockRunner);

      expect(reporter.printReport).toHaveBeenCalledWith(mockRunner);
    });
  });

  describe('printReport', () => {
    it('should not print an accessibility report if there are no violations', () => {
      const reporter = new AccessibilityReporter({});

      jest.spyOn(reporter, 'write').mockImplementationOnce(() => {});

      reporter.printReport();

      expect(reporter.write).not.toHaveBeenCalled();
    });

    it('should print an accessibility report', () => {
      const reporter = new AccessibilityReporter({});

      reporter.accessibilityResults = { 'test-id': { incomplete: [] } };

      jest.spyOn(reporter, 'travelSuite').mockImplementationOnce(() => ('mock output'));
      jest.spyOn(reporter, 'write').mockImplementationOnce(() => {});

      const mockRunner = { specs: ['/mock/spec/file'] };

      reporter.printReport(mockRunner);

      expect(reporter.write).toHaveBeenCalledWith('Spec: /mock/spec/file\nmock output');
    });
  });

  describe('travelSuite', () => {
    it('should travel the suite tree and generate an accessibility report', () => {
      const reporter = new AccessibilityReporter({});

      const report = reporter.travelSuite({
        suites: [],
        tests: [],
      });

      jest.spyOn(reporter, 'formatTestWarning').mockImplementation(() => ('warning - mock test title'));

      expect(report).toEqual('');
    });
  });
});
