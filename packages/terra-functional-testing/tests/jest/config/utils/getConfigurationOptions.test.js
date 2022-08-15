const path = require('path');
const getConfigurationOptions = require('../../../../src/config/utils/getConfigurationOptions');
const getCapabilities = require('../../../../src/config/utils/getCapabilities');
const getIpAddress = require('../../../../src/config/utils/getIpAddress');
const { BUILD_BRANCH, BUILD_TYPE } = require('../../../../src/constants/index');

describe('getCapabilities', () => {
  it('should get configuration from cli options', async () => {
    const options = {
      assetServerPort: 8080,
      browsers: ['chrome'],
      buildBranch: BUILD_BRANCH.pullRequest,
      buildType: BUILD_TYPE.branchEventCause,
      buildUrl: 'www.buildurl.com',
      config: '/path',
      disableSeleniumService: true,
      externalHost: 'externalHost',
      externalPort: 3000,
      formFactor: 'small',
      gitApiUrl: 'www.gitapiurl.com',
      gitToken: '12345',
      gridUrl: 'http',
      issueNumber: '311',
      keepAliveSeleniumDockerService: true,
      locale: 'en',
      site: 'build',
      spec: '/spec/',
      suite: 'test-suite',
      theme: 'terra-default-theme',
      updateScreenshots: true,
      useRemoteReferenceScreenshots: true,
      useSeleniumStandaloneService: false,
    };

    const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');
    const capabilities = getCapabilities(options.browsers, !!options.gridUrl);

    const expectedConfig = {
      baseUrl: `http://${options.externalHost}:${options.externalPort}`,
      capabilities,
      hostname: options.gridUrl,
      port: 80,
      spec: options.spec,
      suite: options.suite,
      launcherOptions: {
        buildBranch: BUILD_BRANCH.pullRequest,
        buildType: BUILD_TYPE.branchEventCause,
        buildUrl: 'www.buildurl.com',
        disableSeleniumService: true,
        formFactor: options.formFactor,
        gitApiUrl: 'www.gitapiurl.com',
        gitToken: '12345',
        gridUrl: options.gridUrl,
        ignoreScreenshotMismatch: undefined,
        issueNumber: '311',
        keepAliveSeleniumDockerService: true,
        locale: options.locale,
        port: options.assetServerPort,
        site: options.site,
        theme: options.theme,
        overrideTheme: options.theme,
        updateScreenshots: true,
        useRemoteReferenceScreenshots: true,
        webpackConfig: defaultWebpackPath,
      },
    };

    const config = getConfigurationOptions(options);

    expect(config).toEqual(expectedConfig);
  });

  it('should get configuration with useSeleniumStandaloneService', async () => {
    const options = {
      assetServerPort: 8080,
      browsers: ['chrome'],
      buildBranch: BUILD_BRANCH.master,
      buildType: BUILD_TYPE.branchEventCause,
      buildUrl: 'www.buildurl.com',
      config: '/path',
      disableSeleniumService: false,
      externalHost: 'externalHost',
      externalPort: 3000,
      formFactor: 'small',
      gitApiUrl: 'www.gitapiurl.com',
      gitToken: '12345',
      issueNumber: '311',
      keepAliveSeleniumDockerService: true,
      locale: 'en',
      site: 'build',
      spec: '/spec/',
      suite: 'test-suite',
      theme: 'terra-default-theme',
      updateScreenshots: true,
      useRemoteReferenceScreenshots: false,
      useSeleniumStandaloneService: true,
    };

    const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');
    const capabilities = getCapabilities(options.browsers, !!options.gridUrl);

    const expectedConfig = {
      baseUrl: `http://${options.externalHost}:${options.externalPort}`,
      capabilities,
      hostname: 'standalone-chrome',
      port: 4444,
      spec: options.spec,
      suite: options.suite,
      launcherOptions: {
        buildBranch: BUILD_BRANCH.master,
        buildType: BUILD_TYPE.branchEventCause,
        buildUrl: 'www.buildurl.com',
        disableSeleniumService: true,
        formFactor: options.formFactor,
        gitApiUrl: 'www.gitapiurl.com',
        gitToken: '12345',
        gridUrl: undefined,
        ignoreScreenshotMismatch: undefined,
        issueNumber: '311',
        keepAliveSeleniumDockerService: true,
        locale: options.locale,
        port: options.assetServerPort,
        site: options.site,
        theme: options.theme,
        overrideTheme: options.theme,
        updateScreenshots: true,
        useRemoteReferenceScreenshots: false,
        webpackConfig: defaultWebpackPath,
      },
    };

    const config = getConfigurationOptions(options);

    expect(config).toEqual(expectedConfig);
  });

  it('should get configuration with empty options', async () => {
    const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');
    const capabilities = getCapabilities(undefined, !!undefined);

    const expectedConfig = {
      baseUrl: `http://${getIpAddress()}:8080`,
      capabilities,
      hostname: 'localhost',
      port: 4444,
      launcherOptions: {
        buildBranch: undefined,
        buildType: undefined,
        buildUrl: undefined,
        disableSeleniumService: false,
        formFactor: undefined,
        gitApiUrl: undefined,
        gitToken: undefined,
        gridUrl: undefined,
        ignoreScreenshotMismatch: undefined,
        issueNumber: undefined,
        keepAliveSeleniumDockerService: undefined,
        locale: undefined,
        port: undefined,
        site: undefined,
        theme: 'terra-default-theme',
        overrideTheme: undefined,
        updateScreenshots: undefined,
        useRemoteReferenceScreenshots: undefined,
        webpackConfig: defaultWebpackPath,
      },
    };

    const config = getConfigurationOptions({});

    expect(config).toEqual(expectedConfig);
  });
});
