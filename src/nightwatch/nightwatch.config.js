/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import ip from 'ip';

import SeleniumDockerService from '../wdio/services/SeleniumDockerService';
import WebpackDevServerService from '../wdio/services/WebpackDevServerService';

let port = 8080;

const seleniumPort = 4444;
const seleniumHost = ip.address();

const nightwatchConfig = (webpackConfig, srcFolders, providedPort) => {
  console.error('WARNING: WebdriverIO should be used instead of Nightwatch.  Nightwatch will be deprecated in the future.');
    
  if (providedPort) {
    port = providedPort;
  }

  const seleniumDocker = new SeleniumDockerService();
  const webPackDevService = new WebpackDevServerService();

  const startDriverAndServer = (done) => {
    const webPackPromise = webPackDevService.onPrepare({
      webpackConfig,
      webpackPort: port,
    });

    const dockerPromise = seleniumDocker.onPrepare({
      host: seleniumHost,
      port: seleniumPort,
      path: '/wd/hub',
      seleniumDocker: {
        enabled: !process.env.TRAVIS && !process.env.CI,
      },
    }, [{ browserName: 'chrome' }]);

    Promise.all([webPackPromise, dockerPromise]).then(done);
  };

  const stopDriverAndServer = (done) => {
    Promise.all([
      webPackDevService.onComplete(),
      seleniumDocker.onComplete(),
    ]).then(done);
  };

  const endBrowserSession = (browser, done) => browser.end(done);

  const config = {
    selenium: {
      start_process: false,
    },
    src_folders: srcFolders,
    output_folder: 'reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: '',
    persist_globals: true,
    test_workers: false,
    detailed_output: !process.env.TRAVIS && !process.env.CI,
    test_settings: {
      default: {
        launch_url: `http://${ip.address()}:${port}`,
        persist_globals: true,
        selenium_port: seleniumPort,
        selenium_host: seleniumHost,
        silent: true,
        globals: {
          breakpoints: {
            tiny: [470, 768],
            small: [622, 768],
            medium: [838, 768],
            large: [1000, 768],
            huge: [1300, 768],
            enormous: [1500, 768],
          },
          asyncHookTimeout: 30000,
          waitForConditionTimeout: 1000,
          retryAssertionTimeout: 1000,
          before: startDriverAndServer,
          after: stopDriverAndServer,
          afterEach: endBrowserSession,
        },
        filter: '**/*-spec.js',
        screenshots: {
          enabled: true,
          on_failure: true,
          on_error: true,
          path: './screenshots',
        },
        desiredCapabilities: {
          browserName: 'chrome',
          javascriptEnabled: true,
          acceptSslCerts: true,
        },
      },
    },
  };
  return config;
};

export default nightwatchConfig;
