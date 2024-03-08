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
    buildType,
    buildUrl,
    disableSeleniumService,
    disableServer,
    externalHost,
    externalPort,
    formFactor,
    gitApiUrl,
    gitToken,
    gridUrl,
    ignoreScreenshotMismatch,
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
    useHttps,
    useRemoteReferenceScreenshots,
    useSeleniumStandaloneService,
  } = options;

  const url = `http://${externalHost || getIpAddress()}:${externalPort || 8080}`;
  return {
    baseUrl: url,
    capabilities: getCapabilities(browsers, !!gridUrl),
    hostname: seleniumServiceUrl || gridUrl || (useSeleniumStandaloneService ? 'standalone-chrome' : 'localhost'),
    port: seleniumServicePort || (gridUrl ? 80 : 4444),
    launcherOptions: {
      buildBranch,
      buildType,
      buildUrl,
      disableSeleniumService: disableSeleniumService || useSeleniumStandaloneService || !!gridUrl,
      disableServer,
      formFactor,
      gitApiUrl,
      gitToken,
      gridUrl,
      ignoreScreenshotMismatch,
      issueNumber,
      keepAliveSeleniumDockerService,
      locale,
      overrideTheme: theme,
      port: assetServerPort,
      site,
      updateScreenshots,
      url,
      useHttps,
      useRemoteReferenceScreenshots,
      ...(theme ? { theme } : { theme: getDefaultThemeName() }),
      ...fs.existsSync(defaultWebpackPath) && !disableServer && { webpackConfig: defaultWebpackPath },
    },
    ...spec && { spec },
    ...suite && { suite },
  };
};

module.exports = getConfigurationOptions;
