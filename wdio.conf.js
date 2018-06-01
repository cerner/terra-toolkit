// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./config/wdio/wdio.conf');
const webpackConfigObject = require('./tests/test.config.js');
const webpackConfigFunction = require('./tests/test.config.func.js');

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

  // Configuration for the SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

  // Configuration for ServeStaticService
  webpackConfig,
};

exports.config = config;
