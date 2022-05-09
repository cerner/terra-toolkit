jest.mock('fs-extra');
jest.mock('js-yaml');
const mockWarn = jest.fn();
jest.mock('@cerner/terra-cli/lib/utils/Logger', () => function mock() {
  return {
    warn: mockWarn,
  };
});

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const getRemoteScreenshotConfiguration = require('../../../../src/config/utils/getRemoteScreenshotConfiguration');

const testScreenshotsSites = {
  repositoryId: 'test-repository-id',
  repositoryUrl: 'https://github.com/cerner/terra-toolkit.git',
};

describe('getRemoteScreenshotConfiguration', () => {
  const oldCwd = process.cwd;
  beforeEach(() => {
    mockWarn.mockClear();
  });

  beforeAll(() => {
    process.cwd = jest.fn();
    process.cwd.mockReturnValue('/app');

    fs.readFileSync.mockReturnValue('yaml string');
    yaml.safeLoad.mockReturnValue({
      'test-repository-id': {
        username: 'username',
        password: 'password',
      },
    });
  });

  afterAll(() => {
    process.cwd = oldCwd;
  });

  it('loads the default config', () => {
    fs.readJsonSync.mockReturnValueOnce({
      name: 'terra-functional-testing',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/cerner/terra-toolkit.git',
      },
    });

    const config = getRemoteScreenshotConfiguration(testScreenshotsSites);
    expect(config).toMatchSnapshot();
    expect(fs.readJsonSync).toHaveBeenCalledWith(path.join(process.cwd(), 'package.json'));
  });

  it('loads the config for branch', () => {
    fs.readJsonSync.mockReturnValueOnce({
      name: 'terra-functional-testing',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/cerner/terra-toolkit.git',
      },
    });
    const config = getRemoteScreenshotConfiguration(testScreenshotsSites, 'dev');
    expect(config).toMatchSnapshot();
    expect(fs.readJsonSync).toHaveBeenCalledWith(path.join(process.cwd(), 'package.json'));
  });

  it('throws an error with a bad site', () => {
    const testSites = {
      repositoryId: 'test-repository-id',
      repositoryUrl: 'http://www.badsite.com',
    };

    fs.readJsonSync.mockReturnValueOnce({
      name: 'terra-functional-testing',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/cerner/terra-toolkit.git',
      },
    });
    expect(() => getRemoteScreenshotConfiguration(testSites)).toThrowErrorMatchingSnapshot();
  });
});
