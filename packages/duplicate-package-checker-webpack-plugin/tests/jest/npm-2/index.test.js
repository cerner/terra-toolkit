const webpack = require('webpack');
const assert = require('assert');
const chalk = require('chalk');
const config = require('./webpack.config');

const chalkLevel = chalk.level;

describe('npm v2 packages', () => {
  beforeEach(() => {
    /**
     * Travis-ci doesn't support colorized string generation with Chalk. To prevent snapshot mismatches
     * with Travis's test output, Chalk is disabled for snapshot tests.
     */
    chalk.level = 0;
  });

  afterEach(() => {
    chalk.level = chalkLevel;
  });

  it('should not output warnings', (done) => {
    webpack(config, (err, stats) => {
      assert(stats.compilation.warnings.length === 0);
      done();
    });
  });
});
