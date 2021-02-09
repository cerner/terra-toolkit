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
   * @param {string} options.formFactor - A form factor for the test run.
   * @param {string} options.locale - A language locale for the test run.
   * @param {string} options.theme - A theme for the test run.
   * @param {string} options.hostname - Automation driver host address.
   * @param {number} options.port - Automation driver port.
   * @param {string} options.baseUrl - The base url.
   * @param {array} options.suite - Overrides specs and runs only the defined suites.
   * @param {array} options.spec - A list of spec file paths.
   * @param {Object} options.launcherOptions - Custom configuration launcher options. i.e. keepAliveSeleniumDockerService; updateScreenshots.
   * @returns {Promise} A promise that resolves with the test run exit code.
   */
  static async run(options) {
    let exitCode;

    try {
      const {
        config,
        formFactor,
        locale,
        theme,
        ...additionalLauncherOptions // hostname, port, baseUrl, suite, spec, launcherOptions
      } = options;

      process.env.LOCALE = locale;
      process.env.THEME = theme;

      if (formFactor) {
        process.env.FORM_FACTOR = formFactor;
      }

      const configPath = TestRunner.configPath(config);
      const testRunner = new Launcher(configPath, additionalLauncherOptions);

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
   * Starts the test runner.
   * @param {string} options.browsers - A list of browsers for the test run.
   * @param {string} options.config - A file path to the test runner configuration.
   * @param {string} options.formFactors - A list of form factors for the test run.
   * @param {string} options.gridUrl - The remote selenium grid address.
   * @param {boolean} options.keepAliveSeleniumDockerService - Determines to keep the selenium docker service running upon test completion.
   * @param {string} options.locales - A list of language locales for the test run.
   * @param {string} options.themes - A list of themes for the test run.
   * @param {string} options.hostname - Automation driver host address.
   * @param {number} options.port - Automation driver port.
   * @param {string} options.baseUrl - The base url.
   * @param {array} options.suite - Overrides specs and runs only the defined suites.
   * @param {array} options.spec - A list of spec file paths.
   * @param {boolean} options.updateScreenshots - Updates all reference screenshots with the latest screenshots.
   */
  static async start(options) {
    const {
      browsers,
      config,
      formFactors = [],
      gridUrl,
      keepAliveSeleniumDockerService,
      locales,
      themes,
      updateScreenshots,
      ...additionalLauncherOptions // hostname, port, baseUrl, suite, spec
    } = options;

    if (browsers) {
      process.env.BROWSERS = browsers;
    }

    if (gridUrl) {
      process.env.SELENIUM_GRID_URL = gridUrl;
    }

    const launcherOptions = {
      ...keepAliveSeleniumDockerService && { keepAliveSeleniumDockerService },
      ...updateScreenshots && { updateScreenshots },
    };

    /**
     * The following code loops through each permutation of theme, locale, and form factor.
     * Each permutation sequentially invokes a new test runner. A new test runner will not start
     * until the previous runner has succeeded. Execution stops if a previous runner fails.
     */
    for (let themeIndex = 0; themeIndex < themes.length; themeIndex += 1) {
      for (let localeIndex = 0; localeIndex < locales.length; localeIndex += 1) {
        let formFactorIndex = 0;

        do {
          const formFactor = formFactors[formFactorIndex];
          const locale = locales[localeIndex];
          const theme = themes[themeIndex];

          // eslint-disable-next-line no-await-in-loop
          await TestRunner.run({
            config,
            formFactor,
            locale,
            theme,
            launcherOptions,
            ...additionalLauncherOptions,
          });

          formFactorIndex += 1;
        } while (formFactorIndex < formFactors.length);
      }
    }
  }
}

module.exports = TestRunner;
