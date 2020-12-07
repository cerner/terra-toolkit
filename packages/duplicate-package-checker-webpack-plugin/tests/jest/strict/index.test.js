const webpack = require('webpack');
const assert = require('assert');
const chalk = require('chalk');
const MakeConfig = require('./make.webpack.config');

const chalkLevel = chalk.level;

describe('Simple dependency tree', () => {
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

  it('should output warnings if strict', (done) => {
    webpack(MakeConfig(), (err, stats) => {
      assert(stats.compilation.warnings.length === 2);
      expect(stats.compilation.warnings[0].message).toMatchSnapshot();
      expect(stats.compilation.warnings[1].message).toMatchSnapshot();
      done();
    });
  });

  it('should not output warnings if not strict', (done) => {
    webpack(
      MakeConfig({
        strict: false,
      }),
      (err, stats) => {
        assert(stats.compilation.warnings.length === 1);
        expect(stats.compilation.warnings[0].message).toMatchSnapshot();
        done();
      },
    );
  });
});
