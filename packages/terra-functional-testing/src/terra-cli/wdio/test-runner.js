const fs = require('fs');
const path = require('path');
const Launcher = require('@wdio/cli').default;
const { Logger } = require('@cerner/terra-cli');

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
   * Runs the test runner.
   * @param {Object} options - The test run options.
   * @param {string} options.config - A file path to the test runner configuration.
   * @param {string} options.locale - A language locale for the test run.
   * @returns {Promise} A promise that resolves with the test run exit code.
   */
  static async run(options) {
    let exitCode;
    try {
      const { config, locale } = options;

      process.env.LOCALE = locale;

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

  /**
   * Starts the test runner(s).
   * @param {string} options.config - A file path to the test runner configuration.
   * @param {string} options.locales - A list of language locales for the test run.
   */
  static async start(options) {
    const { config, locales } = options;

    for (let localeIndex = 0; localeIndex < locales.length; localeIndex += 1) {
      const locale = locales[localeIndex];

      // eslint-disable-next-line no-await-in-loop
      await TestRunner.run({ config, locale });
    }
  }
}

module.exports = TestRunner;
