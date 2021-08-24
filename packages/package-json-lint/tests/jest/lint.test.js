jest.mock('fs-extra');
jest.mock('../../src/rules');
jest.mock('../../src/config');
jest.mock('../../src/project-structure');

const fs = require('fs-extra');
const stripAnsi = require('strip-ansi');
const rules = require('../../src/rules');
const { getRuleConfig, getConfigForFile } = require('../../src/config');
const { getPathsForPackages } = require('../../src/project-structure');

const lint = require('../../src/lint');

let oldConsole;

describe('lint', () => {
  beforeAll(() => {
    oldConsole = global.console;
    global.console = { log: jest.fn() };
  });

  afterAll(() => {
    global.console = oldConsole;
  });

  it('loops through all of the packages and lints them with all of the rules in the config', async () => {
    getConfigForFile.mockResolvedValueOnce({
      rules: {
        'require-no-terra-base-peer-dependency-versions': 'error',
        'require-theme-context-versions': 'error',
      },
      projectType: 'module',
    });
    getConfigForFile.mockResolvedValueOnce({
      rules: {
        'require-no-terra-base-peer-dependency-versions': 'warn',
        'require-theme-context-versions': 'warn',
      },
    });
    getPathsForPackages.mockResolvedValueOnce([
      'path1',
      'path2',
    ]);
    const package1Data = {
      dependencies: { a: '1.0.0' },
    };
    fs.readJson.mockResolvedValueOnce(package1Data);
    const package2Data = {
      dependencies: { b: '1.1.1' },
    };
    fs.readJson.mockResolvedValueOnce(package2Data);
    const package1RuleConfig1 = {
      severity: 'off',
    };
    getRuleConfig.mockReturnValueOnce(package1RuleConfig1);
    const package1RuleConfig2 = {
      severity: 'warning',
    };
    getRuleConfig.mockReturnValueOnce(package1RuleConfig2);
    const package2RuleConfig1 = {
      severity: 'warning',
    };
    getRuleConfig.mockReturnValueOnce(package2RuleConfig1);
    const package2RuleConfig2 = {
      severity: 'error',
    };
    getRuleConfig.mockReturnValueOnce(package2RuleConfig2);

    const mockRule1 = { dependencies: jest.fn() };
    let mockReport1;
    rules['require-no-terra-base-peer-dependency-versions'].create.mockImplementationOnce(({ report }) => {
      mockReport1 = report;
      return mockRule1;
    });
    mockRule1.dependencies.mockImplementationOnce(() => mockReport1({
      lintId: 'require-no-terra-base-peer-dependency-versions', severity: 'warning', lintMessage: 'message1',
    }));
    const mockRule2 = { dependencies: jest.fn() };
    rules['require-theme-context-versions'].create.mockImplementationOnce(() => mockRule2);
    mockRule2.dependencies.mockImplementationOnce(() => {});
    const mockRule3 = { dependencies: jest.fn() };
    let mockReport3;
    rules['require-theme-context-versions'].create.mockImplementationOnce(({ report }) => {
      mockReport3 = report;
      return mockRule3;
    });
    mockRule3.dependencies.mockImplementationOnce(() => mockReport3({
      lintId: 'require-theme-context-versions', severity: 'error', lintMessage: 'message3',
    }));

    global.console.log.mockImplementationOnce((message) => expect(stripAnsi(message)).toMatchSnapshot());

    await lint();

    expect(getConfigForFile).toHaveBeenCalledTimes(2);
    expect(getConfigForFile).toHaveBeenNthCalledWith(1, { packageJsonPath: 'path1' });
    expect(getConfigForFile).toHaveBeenNthCalledWith(2, { packageJsonPath: 'path2' });
    expect(getPathsForPackages).toHaveBeenCalled();
    expect(fs.readJson).toHaveBeenCalledTimes(2);
    expect(fs.readJson).toHaveBeenNthCalledWith(1, 'path1');
    expect(fs.readJson).toHaveBeenNthCalledWith(2, 'path2');
    expect(getRuleConfig).toHaveBeenCalledTimes(4);
    expect(getRuleConfig).toHaveBeenNthCalledWith(1, { rule: rules['require-no-terra-base-peer-dependency-versions'], ruleInformation: 'error' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(2, { rule: rules['require-theme-context-versions'], ruleInformation: 'error' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(3, { rule: rules['require-no-terra-base-peer-dependency-versions'], ruleInformation: 'warn' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(4, { rule: rules['require-theme-context-versions'], ruleInformation: 'warn' });
    expect(rules['require-no-terra-base-peer-dependency-versions'].create).toHaveBeenCalledTimes(1);
    expect(rules['require-no-terra-base-peer-dependency-versions'].create).toHaveBeenCalledWith({ ruleConfig: package2RuleConfig1, projectType: 'module', report: expect.anything() });
    expect(rules['require-theme-context-versions'].create).toHaveBeenCalledTimes(2);
    expect(rules['require-theme-context-versions'].create).toHaveBeenCalledWith({ ruleConfig: package1RuleConfig2, projectType: 'module', report: expect.anything() });
    expect(rules['require-theme-context-versions'].create).toHaveBeenCalledWith({ ruleConfig: package2RuleConfig2, projectType: 'module', report: expect.anything() });
    expect(mockRule1.dependencies).toHaveBeenCalledTimes(1);
    expect(mockRule1.dependencies).toHaveBeenCalledWith({ b: '1.1.1' });
    expect(mockRule2.dependencies).toHaveBeenCalledTimes(1);
    expect(mockRule2.dependencies).toHaveBeenCalledWith({ a: '1.0.0' });
    expect(mockRule3.dependencies).toHaveBeenCalledTimes(1);
    expect(mockRule3.dependencies).toHaveBeenCalledWith({ b: '1.1.1' });
    expect(global.console.log).toHaveBeenCalled();

    jest.resetAllMocks();
  });
});
