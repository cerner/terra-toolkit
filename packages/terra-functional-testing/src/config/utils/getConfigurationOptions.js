const fs = require('fs');
const path = require('path');
const getCapabilities = require('./getCapabilities');
const getIpAddress = require('./getIpAddress');
const getDefaultThemeName = require('./getDefaultThemeName');

const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');

const getConfigurationOptions = (options) => {
  const {
    assetServerPort,
    browsers,
    disableSeleniumService,
    externalHost,
    externalPort,
    formFactor,
    gridUrl,
    keepAliveSeleniumDockerService,
    locale,
    site,
    spec,
    suite,
    theme,
    updateScreenshots,
    useSeleniumStandaloneService,
  } = options;

  return {
    baseUrl: `http://${externalHost || getIpAddress()}:${externalPort || 8080}`,
    capabilities: getCapabilities(browsers, !!gridUrl),
    hostname: gridUrl || (useSeleniumStandaloneService ? 'standalone-chrome' : 'localhost'),
    port: gridUrl ? 80 : 4444,
    launcherOptions: {
      disableSeleniumService: disableSeleniumService || useSeleniumStandaloneService || !!gridUrl,
      formFactor,
      gridUrl,
      keepAliveSeleniumDockerService,
      locale,
      port: assetServerPort,
      site,
      ...(theme ? { theme } : { theme: getDefaultThemeName() }),
      overrideTheme: theme,
      updateScreenshots,
      ...fs.existsSync(defaultWebpackPath) && { webpackConfig: defaultWebpackPath },
    },
    ...spec && { spec },
    ...suite && { suite },
  };
};

module.exports = getConfigurationOptions;
