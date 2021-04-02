jest.mock('fs-extra');
jest.mock('../../src/rules');
jest.mock('../../src/config');
jest.mock('../../src/utilities');

const fs = require('fs-extra');
const stripAnsi = require('strip-ansi');
const rules = require('../../src/rules');
const { getRuleConfig, getConfig } = require('../../src/config');
const { getPathsForPackages } = require('../../src/utilities');

const lint = require('../../src/lint');
const LintIssue = require('../../src/issues/LintIssue');

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
    getConfig.mockResolvedValueOnce({
      rules: {
        'require-no-terra-base-peer-dependency-versions': 'error',
        'require-theme-context-versions': 'error',
      },
    });
    getPathsForPackages.mockResolvedValueOnce([
      'path1',
      'path2',
    ]);
    const package1Data = {
      name: 'package1',
    };
    fs.readJson.mockResolvedValueOnce(package1Data);
    const package2Data = {
      name: 'package2',
    };
    fs.readJson.mockResolvedValueOnce(package2Data);
    const package1RuleConfig1 = {
      severity: 'off',
      lint: jest.fn(),
    };
    getRuleConfig.mockReturnValueOnce(package1RuleConfig1);
    const package1RuleConfig2 = {
      severity: 'warning',
      lint: jest.fn(),
    };
    getRuleConfig.mockReturnValueOnce(package1RuleConfig2);
    const package2RuleConfig1 = {
      severity: 'warning',
      lint: jest.fn(),
    };
    getRuleConfig.mockReturnValueOnce(package2RuleConfig1);
    const package2RuleConfig2 = {
      severity: 'error',
      lint: jest.fn(),
    };
    getRuleConfig.mockReturnValueOnce(package2RuleConfig2);
    rules['require-no-terra-base-peer-dependency-versions'].lint.mockReturnValueOnce(new LintIssue({
      lintId: 'require-no-terra-base-peer-dependency-versions', severity: 'warning', node: 'dependencies', lintMessage: 'message1',
    }));
    rules['require-theme-context-versions'].lint.mockReturnValueOnce(undefined);
    rules['require-theme-context-versions'].lint.mockReturnValueOnce(new LintIssue({
      lintId: 'require-theme-context-versions', severity: 'error', node: 'dependencies', lintMessage: 'message3',
    }));
    global.console.log.mockImplementation((message) => expect(stripAnsi(message)).toMatchSnapshot());

    await lint();

    expect(getConfig).toHaveBeenCalled();
    expect(getPathsForPackages).toHaveBeenCalled();
    expect(fs.readJson).toHaveBeenCalledTimes(2);
    expect(fs.readJson).toHaveBeenNthCalledWith(1, 'path1');
    expect(fs.readJson).toHaveBeenNthCalledWith(2, 'path2');
    expect(getRuleConfig).toHaveBeenCalledTimes(4);
    expect(getRuleConfig).toHaveBeenNthCalledWith(1, { rule: rules['require-no-terra-base-peer-dependency-versions'], ruleInformation: 'error' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(2, { rule: rules['require-theme-context-versions'], ruleInformation: 'error' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(3, { rule: rules['require-no-terra-base-peer-dependency-versions'], ruleInformation: 'error' });
    expect(getRuleConfig).toHaveBeenNthCalledWith(4, { rule: rules['require-theme-context-versions'], ruleInformation: 'error' });
    expect(rules['require-no-terra-base-peer-dependency-versions'].lint).toHaveBeenCalledTimes(1);
    expect(rules['require-no-terra-base-peer-dependency-versions'].lint).toHaveBeenCalledWith({ packageJsonData: package2Data, ruleConfig: package2RuleConfig1 });
    expect(rules['require-theme-context-versions'].lint).toHaveBeenCalledTimes(2);
    expect(rules['require-theme-context-versions'].lint).toHaveBeenCalledWith({ packageJsonData: package1Data, ruleConfig: package1RuleConfig2 });
    expect(rules['require-theme-context-versions'].lint).toHaveBeenCalledWith({ packageJsonData: package2Data, ruleConfig: package2RuleConfig2 });
    expect(global.console.log).toHaveBeenCalled();

    jest.resetAllMocks();
  });
});
