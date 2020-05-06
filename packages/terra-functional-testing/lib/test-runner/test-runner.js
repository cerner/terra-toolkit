const fs = require('fs');
const path = require('path');
const Launcher = require('@wdio/cli').default;

class TestRunner {
  /**
   * Resolves the configuration file path.
   * If no path is provided the current working directory will be searched. Falls back to the default configuration file.
   * @param {string} configPath - The path to the test runner configuration file.
   * @returns {string} A resolved path to the test runner configuration file.
   */
  static configPath(configPath) {
    if (configPath) {
      return path.resolve(configPath);
    }

    const relativeConfigPath = path.resolve(process.cwd(), 'wdio.conf.js');

    if (fs.existsSync(relativeConfigPath)) {
      return relativeConfigPath;
    }

    return path.resolve(__dirname, './wdio.conf.js');
  }

  /**
   * Starts the test runner.
   * @param {Object} options - The test run options.
   * @returns {Promise} A promise that resolves with the test run exit code.
   */
  static async run(options) {
    try {
      const { config } = options;

      const configPath = TestRunner.configPath(config);
      const testRunner = new Launcher(configPath);

      const exitCode = await testRunner.run();

      process.exit(exitCode);
    } catch (error) {
      console.error('Launcher failed to start the test.\n', error);
      process.exit(1);
    }
  }
}

module.exports = TestRunner;
