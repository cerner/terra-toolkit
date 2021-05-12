import fs from 'fs';
import path from 'path';
import TerraVerboseReporter from '../../src/reporters/verbose-reporter/TerraVerboseReporter';

jest.mock('fs');

describe('Jest File Reporter Testing', () => {
  let fsWriteSpy;

  beforeEach(() => {
    fsWriteSpy = jest.spyOn(fs, 'writeFileSync');
  });

  afterEach(() => {
    fsWriteSpy.mockClear();
  });

  it('should have startdate property in the test results', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunStart({ startTime: 'Fri May 01 2020 00:22:30' });
    expect(terraVerboseReporter.results).toHaveProperty('startDate');
  });

  it('should have endDate and output property in the test results', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.log('message \n random');
    terraVerboseReporter.onRunComplete();
    expect(terraVerboseReporter.results).toHaveProperty('output');
    expect(terraVerboseReporter.results).toHaveProperty('endDate');
    expect(typeof terraVerboseReporter.results.output).toEqual('object');
  });

  it('should have output property in the result and have some length while calling log ', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.log('test');
    terraVerboseReporter.onRunComplete();
    expect(fsWriteSpy).toBeCalled();
  });

  it('should call setTestDirPath and include test in reporter filePath', () => {
    const verboseReporter = new TerraVerboseReporter({});
    expect(verboseReporter.filePath).toEqual(expect.stringContaining('test'));
  });

  describe('setTestModule', () => {
    it('should set this.moduleName when root folder has package directory', () => {
      const verboseReporter = new TerraVerboseReporter({});
      verboseReporter.setTestModule('terra-toolkit-boneyard/packages/terra-clinical-header/tests/wdio/test-spec.js');
      expect(verboseReporter.moduleName).toBe('terra-clinical-header');
    });

    it('should set this.moduleName when root folder has package directory and is windows path', () => {
      const verboseReporter = new TerraVerboseReporter({});

      const separator = path.sep;
      path.sep = '\\';

      expect(verboseReporter.moduleName).toEqual('terra-toolkit');
      verboseReporter.setTestModule('C:\\project\\packages\\my-package\\tests\\wdio\\test-spec.js');
      expect(verboseReporter.moduleName).toEqual('my-package');

      path.sep = separator;
    });
  });

  it('should set this.moduleName when root folder has package directory', () => {
    const verboseReporter = new TerraVerboseReporter({});
    verboseReporter.setTestModule('packages/terra-clinical-header');
    expect(verboseReporter.moduleName).toEqual('terra-clinical-header');
  });

  it('should skip this.moduleName when root folder doesn\'t has package directory', () => {
    const verboseReporter = new TerraVerboseReporter({});
    verboseReporter.setTestModule('');
    expect(verboseReporter.moduleName).toEqual(process.cwd().split('/').pop());
  });

  it('Do we have moduleName in results.output', () => {
    const verboseReporter = new TerraVerboseReporter({});
    verboseReporter.setTestModule('');
    expect(verboseReporter.moduleName).toEqual(process.cwd().split('/').pop());
  });
});
