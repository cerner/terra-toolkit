const getCapabilities = require('./getCapabilities');
const getIpAddress = require('./getIpAddress');

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

const getConfigurationOptions = (options) => {
  const {
    assetServerPort,
    disableSeleniumService,
    browsers,
    formFactor,
    locale,
    externalHost,
    externalPort,
    gridUrl,
    site,
    spec,
    suite,
    updateScreenshots,
    theme,
  } = options;

  return {
    baseUrl: `http://${WDIO_EXTERNAL_HOST || externalHost || getIpAddress()}:${WDIO_EXTERNAL_PORT || externalPort || 8080}`,
    capabilities: getCapabilities(BROWSERS || browsers, SELENIUM_GRID_URL || gridUrl),
    hostname: SELENIUM_GRID_URL || gridUrl || 'localhost',
    port: (SELENIUM_GRID_URL || gridUrl) ? 80 : 4444,
    launcherOptions: {
      assetServerPort: WDIO_INTERNAL_PORT || assetServerPort,
      disableSeleniumService: WDIO_DISABLE_SELENIUM_SERVICE || disableSeleniumService,
      formFactor: FORM_FACTOR || formFactor,
      gridUrl: SELENIUM_GRID_URL || gridUrl,
      locale: LOCALE || locale,
      theme: THEME || theme,
      site: SITE || site,
      updateScreenshots,
    },
    ...spec && { spec },
    ...suite && { suite },
  };
};

module.exports = getConfigurationOptions;
