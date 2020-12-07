const webpack = require('webpack');
const chalk = require('chalk');
const config = require('./webpack.config');

const chalkLevel = chalk.level;

describe('Dependency tree with non-root package.json', () => {
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

  it('should output warnings', (done) => {
    webpack(config, (err, stats) => {
      expect(stats.compilation.warnings[0].message).toMatchSnapshot();
      done();
    });
  });
});
