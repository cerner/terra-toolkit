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
      'cerner-release-main-site': {
        username: 'username',
        password: 'password',
      },
      'ion-snapshot-site': {
        username: 'ion',
        password: 'ion',
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

    const config = getRemoteScreenshotConfiguration();
    expect(config).toMatchSnapshot();
    expect(fs.readJsonSync).toHaveBeenCalledWith(path.join(process.cwd(), 'package.json'));
  });

  it('loads the config from the package', () => {
    fs.readJsonSync.mockReturnValueOnce({
      name: 'terra-functional-testing',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/cerner/terra-toolkit.git',
      },
      rollOut: {
        artifactId: 'mock-artifact-id',
        groupId: 'mock-group-id',
        site: {
          repositoryId: 'release-internal-site',
          repositoryUrl: 'http://repo.release.cerner.corp/nexus/service/local/repositories/internal-site',
        },
        jestConfig: 'jest.js',
        webpackConfig: 'webpack.js',
      },
    });
    const config = getRemoteScreenshotConfiguration();
    expect(config).toMatchSnapshot();
    expect(fs.readJsonSync).toHaveBeenCalledWith(path.join(process.cwd(), 'package.json'));
  });

  it('throws an error with a bad site', () => {
    fs.readJsonSync.mockReturnValueOnce({
      name: 'terra-functional-testing',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/cerner/terra-toolkit.git',
      },
      rollOut: {
        artifactId: 'mock-artifact-id',
        groupId: 'mock-group-id',
        site: {
          repositoryId: 'release-internal-site',
          repositoryUrl: 'http://www.badsite.com',
        },
      },
    });
    expect(() => getRemoteScreenshotConfiguration()).toThrowErrorMatchingSnapshot();
  });
});
