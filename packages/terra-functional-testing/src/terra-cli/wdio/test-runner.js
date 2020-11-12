const fs = require('fs');
const path = require('path');
const Launcher = require('@wdio/cli').default;
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio]' });

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

    return path.resolve(__dirname, '../../config/wdio.conf.js');
  }

  /**
   * Starts the test runner.
   * @param {Object} options - The test run options.
   * @returns {Promise} A promise that resolves with the test run exit code.
   */
  static async run(options) {
    let exitCode;
    try {
      const { config } = options;

      const configPath = TestRunner.configPath(config);
      const testRunner = new Launcher(configPath);

      exitCode = await testRunner.run();
    } catch (error) {
      logger.error('Launcher failed to start the test');
      throw error;
    }

    if (exitCode !== 0) {
      throw new Error(`[terra-functional-testing:wdio] Launcher returned with an exit code of ${exitCode}`);
    }
  }
}

module.exports = TestRunner;
