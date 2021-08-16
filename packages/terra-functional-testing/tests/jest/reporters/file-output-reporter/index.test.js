import fs from 'fs';
import path from 'path';
import FileOutputReporter from '../../../../src/reporters/file-output-reporter';

jest.mock('fs');

describe('FileOutputReporter', () => {
  const originalProcessCwd = process.cwd;
  beforeAll(() => {
    process.cwd = jest.fn().mockImplementation(() => './terra-toolkit');
    global.browser = {
      config: {
        launcherOptions: {
          formFactor: 'tiny',
          locale: 'en',
          theme: 'default',
          cloudRegion: 'dev',
        },
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.cwd = originalProcessCwd;
    global.browser = {};
  });

  describe('initialization', () => {
    it('defines resultJsonObject', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject).toHaveProperty('startDate');
      expect(reporter.resultJsonObject).toHaveProperty('endDate');
      expect(reporter.resultJsonObject).toHaveProperty('type');
      expect(reporter.resultJsonObject).toHaveProperty('cloudRegion');
      expect(typeof reporter.resultJsonObject.output).toEqual('object');
    });

    it('defines fileName', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      expect(reporter.fileName).toBe('');
    });

    it('defines packageName', () => {
      const moduleName = FileOutputReporter.getPackageName('terra-toolkit/tests/wdio/test-spec.js');
      expect(moduleName).toBe('terra-toolkit');
    });

    describe('determines results dir', () => {
      it('set outputDir ', () => {
        fs.existsSync.mockReturnValue(false);
        const reporter = new FileOutputReporter({ writeStream: {} });
        expect(reporter.resultsDir).toEqual(expect.stringContaining('tests/wdio/reports'));
      });

      it('set provided outputDir ', () => {
        fs.existsSync.mockReturnValue(false);
        const reporter = new FileOutputReporter({ writeStream: {}, outputDir: 'other' });
        expect(reporter.resultsDir).toEqual(expect.stringContaining('tests/other/reports'));
      });
    });

    describe('ensures results dir exists', () => {
      it('when dir exists', () => {
        fs.existsSync.mockReturnValue(true);
        const reporter = new FileOutputReporter({ writeStream: {} });
        reporter.hasResultsDir();
        expect(fs.mkdirSync).not.toHaveBeenCalled();
      });

      it('when dir does not exists', () => {
        fs.existsSync.mockReturnValue(false);
        const reporter = new FileOutputReporter({ writeStream: {} });
        reporter.hasResultsDir();
        expect(fs.mkdirSync).toHaveBeenCalled();
      });
    });
  });

  describe('buildFileName', () => {
    it('sets default file name', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        cid: '0-1',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-0-1');
    });

    it('sets file name with locale', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        cid: '0-1',
        locale: 'en',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-en-0-1');
    });

    it('sets file name with locale and theme', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        cid: '0-1',
        locale: 'en',
        theme: 'default',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-en-default-0-1');
    });

    it('sets file name with locale, theme and formFactor', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        cid: '0-1',
        formFactor: 'tiny',
        locale: 'en',
        theme: 'default',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-en-default-tiny-0-1');
    });

    it('sets file name with locale, theme, formFactor, browser and cid', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        browserName: 'chrome',
        cid: '0-1',
        formFactor: 'tiny',
        locale: 'en',
        theme: 'default',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-en-default-tiny-chrome-0-1');
    });

    it('sets file name with locale, theme, formFactor, browser, cloudRegion, and cid', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        browserName: 'chrome',
        cid: '0-1',
        formFactor: 'tiny',
        locale: 'en',
        theme: 'default',
        cloudRegion: 'dev',
      };

      reporter.buildFileName(options);

      expect(reporter.fileName).toEqual('fileOutput-en-default-tiny-chrome-dev-0-1');
    });
  });

  describe('updateResultObject', () => {
    it('sets resultJsonObject with locale, theme and formFactor', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      const options = {
        formFactor: 'tiny',
        locale: 'en',
        theme: 'default',
      };

      reporter.updateResultObject(options);

      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', 'tiny');
    });

    it('sets resultJsonObject with empty option', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });

      reporter.updateResultObject({});

      expect(reporter.resultJsonObject).toHaveProperty('locale', '');
      expect(reporter.resultJsonObject).toHaveProperty('theme', '');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
    });
  });

  describe('getPackageName', () => {
    it('updates moduleName if mono-repo test file', () => {
      const packageName = FileOutputReporter.getPackageName('terra-toolkit/packages/my-package/tests/wdio/test-spec.js');
      expect(packageName).toEqual('my-package');
    });

    it('updates moduleName if mono-repo test file if windows path', () => {
      const separator = path.sep;
      path.sep = '\\';
      const packageName = FileOutputReporter.getPackageName('C:\\project\\packages\\my-package\\tests\\wdio\\test-spec.js');
      expect(packageName).toEqual('my-package');

      path.sep = separator;
    });

    it('does not updates moduleName if non mono-repo test file', () => {
      const moduleName = FileOutputReporter.getPackageName('terra-functional-testing/tests/wdio/test-spec.js');
      expect(moduleName).toEqual('terra-toolkit');
    });
  });

  describe('printReport', () => {
    const runner = {
      cid: '0-0',
      specs: ['/packages/terra-functional-testing/tests/wdio/hideInputCaret-spec.js'],
      capabilities: {
        browserName: 'firefox',
      },
      config: {
        launcherOptions: {
          locale: 'en',
          theme: 'terra-default-theme',
          formFactor: 'small',
          cloudRegion: 'dev',
        },
      },
    };
    describe('when no specs run - does not write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new FileOutputReporter({ writeStream: {} });
      reporter.runners = {};
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('when one spec runs - write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new FileOutputReporter({ writeStream: {} });
      reporter.runners = [runner];
      reporter.getSuiteResult = jest.fn().mockReturnValue('wdio test results');
      const getMessage = jest.fn();
      reporter.getMessage = getMessage;
      reporter.getMessage.mockReturnValue('[chrome 69.0.3497.100 Linux #0-2] Spec: /Users/sn081183/Desktop/terra/terra-toolkit/packages/terra-functional-testing/tests/wdio/terra-validates-spec.js,[chrome 69.0.3497.100 Linux #0-2] Running: chrome (v69.0.3497.100) on Linux,[chrome 69.0.3497.100 Linux #0-2] Session ID: 8bc8d5b1a51f746454ff9714b57c9fd8,[chrome 69.0.3497.100 Linux #0-2],[chrome 69.0.3497.100 Linux #0-2] [small],[chrome 69.0.3497.100 Linux #0-2]  ');
      reporter.printReport();
      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject.output['terra-functional-testing']).toHaveLength(1);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('when many specs run - write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new FileOutputReporter({ writeStream: {} });
      reporter.runners = [runner, { ...runner, cid: '0-1' }];
      reporter.getSuiteResult = jest.fn().mockReturnValue('wdio test results\n');
      const getMessage = jest.fn();
      reporter.getMessage = getMessage;
      reporter.getMessage.mockReturnValue('[chrome 69.0.3497.100 Linux #0-2] Spec: /Users/sn081183/Desktop/terra/terra-toolkit/packages/terra-functional-testing/tests/wdio/terra-validates-spec.js,[chrome 69.0.3497.100 Linux #0-2] Running: chrome (v69.0.3497.100) on Linux,[chrome 69.0.3497.100 Linux #0-2] Session ID: 8bc8d5b1a51f746454ff9714b57c9fd8,[chrome 69.0.3497.100 Linux #0-2],[chrome 69.0.3497.100 Linux #0-2] [small],[chrome 69.0.3497.100 Linux #0-2]  ');
      reporter.printReport();
      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject.output['terra-functional-testing']).toHaveLength(2);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('printSuitesSummary', () => {
    const stats = {
      start: 'Tue Apr 28 2020 12:14:56',
      end: 'Tue Apr 28 2020 12:14:59',
    };

    it('adds start and end dates to resultJsonObject', () => {
      const reporter = new FileOutputReporter({ writeStream: {} });
      reporter.baseReporter = { stats };
      reporter.printReport = jest.fn();
      reporter.printReport();
      expect(reporter.resultJsonObject).toHaveProperty('endDate');
      expect(reporter.resultJsonObject).toHaveProperty('startDate');
      expect(reporter.printReport).toHaveBeenCalled();
    });
  });
});
