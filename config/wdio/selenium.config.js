const http = require('http');

const chromeConfig = {
  browserName: 'chrome',
  maxInstances: 1,
  loggingPrefs: {
    performance: 'ALL',
  },
  'goog:chromeOptions': {
    /** Run in headless mode since Chrome 69 cannot reach the tiny viewport size due to a omnibox size change
     * made by the chrome team. See https://bugs.chromium.org/p/chromedriver/issues/detail?id=2626#c1.
     */
    args: ['headless', 'disable-gpu'],
    perfLoggingPrefs: {
      traceCategories: 'blink.console, devtools.timeline, toplevel, disabled-by-default-devtools.timeline, disabled-by-default-devtools.timeline.frame',
    },
  },
};

const firefoxConfig = {
  browserName: 'firefox',
  maxInstances: 1,
  'moz:firefoxOptions': {
    args: ['-headless'],
  },
};

const ieConfig = {
  browserName: 'internet explorer',
  maxInstances: 1,
  /** IE Driver custom capabilities must be passed as a sub-object specified under 'se:ieOptions' key for
   * version ^3.3.0.1. and Webdriver.io does not pass these as a sub-options.
   * See https://github.com/SeleniumHQ/selenium/blob/master/cpp/iedriverserver/CHANGELOG#L782.
   */
  'se:ieOptions': {
    javascriptEnabled: true,
    locationContextEnabled: true,
    handlesAlerts: true,
    rotatable: true,
  },
};

const determineCapabililities = ({ useSeleniumGrid, browsers }) => {
  const capabilities = [];

  if (!browsers) {
    if (useSeleniumGrid) {
      capabilities.push(chromeConfig, firefoxConfig, ieConfig);
    }
    capabilities.push(chromeConfig);
  } else {
    if (browsers.includes('chrome')) {
      capabilities.push(chromeConfig);
    }
    if (browsers.includes('firefox')) {
      capabilities.push(firefoxConfig);
    }
    if (useSeleniumGrid && browsers.includes('ie')) {
      capabilities.push(ieConfig);
    }
  }
  /* Randomized the browser order to help reduce a heavy number of session request made to the grid for each browser at once. */
  return capabilities.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
};

const determineConfig = (envs) => {
  const {
    ci, seleniumGridUrl, browsers,
  } = envs;

  const useSeleniumGrid = seleniumGridUrl !== undefined;

  const config = {
    seleniumVersion: '3.14',
    seleniumDocker: {
      enabled: !(ci || useSeleniumGrid),
    },
    capabilities: determineCapabililities({ useSeleniumGrid, browsers }),
  };

  if (useSeleniumGrid) {
    config.host = seleniumGridUrl;
    config.port = '80';
    config.path = '/wd/hub';
    config.agent = new http.Agent({ keepAlive: true, timeout: 600000 });
  }

  if (ci) {
    config.host = 'standalone-chrome';
  }

  return config;
};

exports.determineConfig = determineConfig;
