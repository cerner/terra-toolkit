const path = require('path');
const fs = require('fs');
const wdioConf = require('./config/wdio/wdio.conf');
const webpackConfigObject = require('./tests/test.config.js');
const webpackConfigFunction = require('./tests/test.config.func.js');

const site = path.join('./build');
const siteExists = fs.existsSync(site) && fs.lstatSync(site).isDirectory() && fs.readdirSync(site).length > 0;

const webpackConfig = process.env.TT_TEST_WDIO_FUNCTION ? webpackConfigFunction : webpackConfigObject;

const config = {
  ...wdioConf.config,

  terra: {
    selector: '[data-terra-toolkit-content]',
  },

  serveStatic: {
    index: 'compare.html',
  },

  suites: {
    opinionated: [
      'tests/wdio/axe-spec.js',
      'tests/wdio/beAccessible-spec.js',
      'tests/wdio/compare-spec.js',
      'tests/wdio/matchScreenshot-spec.js',
      'tests/wdio/resize-spec.js',
      'tests/wdio/validateElement-spec.js',
      'tests/wdio/describeViewports-spec.js',
      'tests/wdio/timeout-spec.js',
    ],
    unopinionated: [
      'tests/wdio/i18n-spec.js',
      'tests/wdio/validateElement-spec.js',
      'tests/wdio/hideInputCaret-spec.js',
    ],
    static: [
      'tests/wdio/axe-spec.js',
      'tests/wdio/beAccessible-spec.js',
      'tests/wdio/compare-spec.js',
      'tests/wdio/matchScreenshot-spec.js',
      'tests/wdio/resize-spec.js',
      'tests/wdio/validateElement-spec.js',
      'tests/wdio/serveStatic-spec.js',
      'tests/wdio/describeViewports-spec.js',
    ],
    noFormFactor: [
      'tests/wdio/validateElement-spec.js',
      'tests/wdio/defaultViewports-spec.js',
    ],
  },
  // Static site for ServeStaticService
  ...siteExists && { site },

  // Configuration for ServeStaticService
  webpackConfig,
};

exports.config = config;
