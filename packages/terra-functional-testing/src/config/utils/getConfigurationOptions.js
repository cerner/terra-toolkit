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
    buildBranch,
    buildUrl,
    disableSeleniumService,
    ignoreScreenshotMismatch,
    externalHost,
    externalPort,
    formFactor,
    gitApiUrl,
    gitToken,
    gridUrl,
    issueNumber,
    keepAliveSeleniumDockerService,
    locale,
    seleniumServicePort,
    seleniumServiceUrl,
    site,
    spec,
    suite,
    theme,
    updateScreenshots,
    useRemoteReferenceScreenshots,
    useSeleniumStandaloneService,
  } = options;

  return {
    baseUrl: `http://${externalHost || getIpAddress()}:${externalPort || 8080}`,
    capabilities: getCapabilities(browsers, !!gridUrl),
    hostname: seleniumServiceUrl || gridUrl || (useSeleniumStandaloneService ? 'standalone-chrome' : 'localhost'),
    port: seleniumServicePort || (gridUrl ? 80 : 4444),
    launcherOptions: {
      buildBranch,
      buildUrl,
      disableSeleniumService: disableSeleniumService || useSeleniumStandaloneService || !!gridUrl,
      ignoreScreenshotMismatch,
      formFactor,
      gitApiUrl,
      gitToken,
      gridUrl,
      keepAliveSeleniumDockerService,
      issueNumber,
      locale,
      port: assetServerPort,
      site,
      ...(theme ? { theme } : { theme: getDefaultThemeName() }),
      overrideTheme: theme,
      updateScreenshots,
      useRemoteReferenceScreenshots,
      ...fs.existsSync(defaultWebpackPath) && { webpackConfig: defaultWebpackPath },
    },
    ...spec && { spec },
    ...suite && { suite },
  };
};

module.exports = getConfigurationOptions;
