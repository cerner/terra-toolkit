// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const fs = require('fs');
const wdioConf = require('./config/wdio/wdio.conf');
const webpackConfigObject = require('./tests/test.config.js');
const webpackConfigFunction = require('./tests/test.config.func.js');

const site = path.join('./build');
const siteExists = fs.existsSync(site) && fs.lstatSync(site).isDirectory();

const webpackConfig = process.env.TT_TEST_WDIO_FUNCTION ? webpackConfigFunction : webpackConfigObject;

const config = {
  ...wdioConf.config,

  terra: {
    selector: '[data-terra-toolkit-content]',
  },

  axe: {
    inject: true,
    options: {
      rules: [
        { id: 'landmark-one-main', enabled: false },
        { id: 'region', enabled: false },
      ],
    },
  },

  suites: {
    opinionated: [
      'tests/wdio/axe-spec.js',
      'tests/wdio/beAccessible-spec.js',
      'tests/wdio/compare-spec.js',
      'tests/wdio/matchScreenshot-spec.js',
      'tests/wdio/resize-spec.js',
    ],
    unopinionated: [
      'tests/wdio/i18n-spec.js',
      'tests/wdio/theme-spec.js',
    ],
  },
  // Static site for ServeStaticService
  ...siteExists && { site },

  // Configuration for ServeStaticService
  webpackConfig,
};

exports.config = config;
