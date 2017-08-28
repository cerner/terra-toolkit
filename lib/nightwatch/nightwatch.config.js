'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromedriver = require('chromedriver');

var _chromedriver2 = _interopRequireDefault(_chromedriver);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = 8080; /* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "chromedriver" }] */

var nightwatchConfig = function nightwatchConfig(webpackConfig, srcFolders, providedPort) {
  if (providedPort) {
    port = providedPort;
  }

  var webpackServer = new _webpackDevServer2.default((0, _webpack2.default)(webpackConfig), { quiet: true, hot: false, inline: false });

  var startDriverAndServer = function startDriverAndServer(done) {
    _chromedriver2.default.start();
    webpackServer.listen(port, '0.0.0.0', function () {
      return done();
    });
  };

  var stopDriverAndServer = function stopDriverAndServer(done) {
    webpackServer.close();
    _chromedriver2.default.stop();
    done();
  };

  var endBrowserSession = function endBrowserSession(browser, done) {
    return browser.end(done);
  };

  var config = {
    selenium: {
      start_process: false
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
        launch_url: 'http://localhost:' + port,
        persist_globals: true,
        selenium_port: 9515,
        selenium_host: 'localhost',
        default_path_prefix: '',
        silent: true,
        globals: {
          breakpoints: {
            tiny: [470, 768],
            small: [622, 768],
            medium: [838, 768],
            large: [1000, 768],
            huge: [1300, 768],
            enormous: [1500, 768]
          },
          asyncHookTimeout: 30000,
          waitForConditionTimeout: 1000,
          retryAssertionTimeout: 1000,
          before: startDriverAndServer,
          after: stopDriverAndServer,
          afterEach: endBrowserSession
        },
        filter: '**/*-spec.js',
        screenshots: {
          enabled: true,
          on_failure: true,
          on_error: true,
          path: './screenshots'
        },
        desiredCapabilities: {
          browserName: 'chrome',
          javascriptEnabled: true,
          acceptSslCerts: true,
          chromeOptions: {
            args: ['--headless', '--disable-gpu', '--no-sandbox']
          }
        }
      }
    }
  };
  return config;
};

exports.default = nightwatchConfig;