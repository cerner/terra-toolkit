/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "chromedriver" }] */

// import chromedriver from 'chromedriver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import seleniumServerStandaloneJar from 'selenium-server-standalone-jar';

let port = 8080;

const nightwatchConfig = (webpackConfig, srcFolders, providedPort) => {
  if (providedPort) {
    port = providedPort;
  }

  const webpackServer = new WebpackDevServer(webpack(webpackConfig), { quiet: true, hot: false, inline: false });
  const stopWebpackDevServer = done => webpackServer.close(() => done());
  const startWebpackDevServer = done => webpackServer.listen(port, '0.0.0.0', () => done());

  // console.log(chromedriver.getCapabilities().getCapability("chrome"));
  const config = {
    selenium: {
      server_path: seleniumServerStandaloneJar.path,
      start_process: true,
      selenium: {
        cli_args: { 'webdriver.chrome.driver': './bin/chromedriver' },
      },
    },
    src_folders: srcFolders,
    output_folder: 'reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: '',
    persist_globals: true,
    test_workers: false,
    test_settings: {
      default: {
        launch_url: `http://localhost:${port}`,
        persist_globals: true,
        selenium_port: 4444,
        selenium_host: 'localhost',
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
          before: startWebpackDevServer,
          after: stopWebpackDevServer,
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
          chromeOptions: {
            args: [
              '--headless',
              '--disable-gpu',
              '--no-sandbox',
              'enable-automation',
            ],
          },
        },
      },
    },
  };
  return config;
};

export default nightwatchConfig;
