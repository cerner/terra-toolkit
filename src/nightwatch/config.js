/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "chromedriver" }] */

import fs from 'fs';
import glob from 'glob';
import chromedriver from 'chromedriver';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import seleniumServerStandaloneJar from 'selenium-server-standalone-jar';

const port = 8080;

const sourceFolders = packages => packages
  .map(pkgs => glob.sync(pkgs))
  .reduce((all, pkg) => all.concat(pkg), [])
  .filter(packagePath => fs.existsSync(`${packagePath}/tests/nightwatch`));

const nightwatchConfig = (packages, webpackConfig) => {
  const webpackServer = new WebpackDevServer(webpack(webpackConfig), { quiet: true, hot: false, inline: false });
  const stopWebpackDevServer = done => webpackServer.close(() => done());
  const startWebpackDevServer = (done) => {
    webpackServer.listen(port, '0.0.0.0', (err) => {
      if (err) {
        throw new Error(err);
      }
      done();
    });
  };

  const config = {
    selenium: {
      server_path: seleniumServerStandaloneJar.path,
      start_process: true,
      selenium: {
        cli_args: { 'webdriver.chrome.driver': chromedriver.path },
      },
    },
    src_folders: sourceFolders(packages),
    output_folder: 'reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: '',
    persist_globals: true,
    detailed_output: false,
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
          before: startWebpackDevServer,
          after: stopWebpackDevServer,
        },
        filter: 'tests/nightwatch/*-spec.js',
        screenshots: {
          enabled: true,
          path: './screenshots',
        },
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            args: [
              '--headless',
              '--disable-gpu ',
              '--no-sandbox ',
            ],
          },
        },
      },
    },
  };
  return config;
};

export default nightwatchConfig;
