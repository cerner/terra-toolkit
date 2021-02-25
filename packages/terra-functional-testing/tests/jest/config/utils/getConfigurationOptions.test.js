const path = require('path');
const getConfigurationOptions = require('../../../../src/config/utils/getConfigurationOptions');
const getCapabilities = require('../../../../src/config/utils/getCapabilities');
const getIpAddress = require('../../../../src/config/utils/getIpAddress');

describe('getCapabilities', () => {
  it('should get configuration from cli options', async () => {
    const options = {
      assetServerPort: 8080,
      browsers: ['chrome'],
      config: '/path',
      disableSeleniumService: true,
      externalHost: 'externalHost',
      externalPort: 3000,
      formFactor: 'small',
      gridUrl: 'http',
      keepAliveSeleniumDockerService: true,
      locale: 'en',
      site: 'build',
      spec: '/spec/',
      suite: 'test-suite',
      theme: 'terra-default-theme',
      updateScreenshots: true,
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
        disableSeleniumService: true,
        formFactor: options.formFactor,
        gridUrl: options.gridUrl,
        keepAliveSeleniumDockerService: true,
        locale: options.locale,
        port: options.assetServerPort,
        site: options.site,
        theme: options.theme,
        updateScreenshots: true,
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
        disableSeleniumService: false,
        formFactor: undefined,
        gridUrl: undefined,
        keepAliveSeleniumDockerService: undefined,
        locale: undefined,
        port: undefined,
        site: undefined,
        theme: undefined,
        updateScreenshots: undefined,
        webpackConfig: defaultWebpackPath,
      },
    };

    const config = getConfigurationOptions({});

    expect(config).toEqual(expectedConfig);
  });
});
