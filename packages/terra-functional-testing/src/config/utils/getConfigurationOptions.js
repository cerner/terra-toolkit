const fs = require('fs');
const path = require('path');
const getCapabilities = require('./getCapabilities');
const getIpAddress = require('./getIpAddress');

const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');

const getConfigurationOptions = (options) => {
  const {
    BROWSERS,
    FORM_FACTOR,
    LOCALE,
    SELENIUM_GRID_URL,
    SITE,
    THEME,
    WDIO_DISABLE_SELENIUM_SERVICE,
    WDIO_EXTERNAL_HOST,
    WDIO_EXTERNAL_PORT,
    WDIO_INTERNAL_PORT,
  } = process.env;

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
  } = options;

  return {
    baseUrl: `http://${WDIO_EXTERNAL_HOST || externalHost || getIpAddress()}:${WDIO_EXTERNAL_PORT || externalPort || 8080}`,
    capabilities: getCapabilities(BROWSERS || browsers, !!SELENIUM_GRID_URL || !!gridUrl),
    hostname: SELENIUM_GRID_URL || gridUrl || 'localhost',
    port: (SELENIUM_GRID_URL || gridUrl) ? 80 : 4444,
    launcherOptions: {
      disableSeleniumService: !!WDIO_DISABLE_SELENIUM_SERVICE || !!SELENIUM_GRID_URL || disableSeleniumService || !!gridUrl,
      formFactor: FORM_FACTOR || formFactor,
      gridUrl: SELENIUM_GRID_URL || gridUrl,
      keepAliveSeleniumDockerService,
      locale: LOCALE || locale,
      port: WDIO_INTERNAL_PORT || assetServerPort,
      site: SITE || site,
      theme: THEME || theme,
      updateScreenshots,
      ...fs.existsSync(defaultWebpackPath) && { webpackConfig: defaultWebpackPath },
    },
    ...spec && { spec },
    ...suite && { suite },
  };
};

module.exports = getConfigurationOptions;
