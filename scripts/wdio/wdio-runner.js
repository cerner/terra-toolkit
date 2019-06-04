const { Launcher } = require('webdriverio');
const Logger = require('../utils/logger');

const context = '[Terra-Tookit:wdio-runner]';

async function wdioRunner(options) {
  const {
    configPath, testlocales, formFactors, gridUrl, browsers, continueOnFail, ...testSetup
  } = options;
  const locales = testlocales || ['en'];
  const factors = formFactors || [undefined];

  if (gridUrl) {
    process.env.USE_SELENIUM_GRID = true;
    process.env.SELENIUM_GRID_URL = gridUrl;
  }

  if (browsers) {
    process.env.BROWSERS = browsers;
  }

  for (let localeI = 0; localeI < locales.length; localeI += 1) {
    const locale = locales[localeI];
    process.env.LOCALE = locale;

    for (let factor = 0; factor < factors.length; factor += 1) {
      let envValues = `LOCALE=${locale} `;

      const form = factors[factor];
      if (form) {
        process.env.FORM_FACTOR = form;
        envValues += `FORM_FACTOR=${form}`;
      }
      envValues = Logger.emphasis(envValues);
      Logger.log(`Running tests for: ${envValues}`, { context });

      // eslint-disable-next-line no-await-in-loop
      await new Launcher(configPath, testSetup)
        .run()
        .then(
          (code) => {
            if (code === 1 && !continueOnFail) {
              Logger.error(`Running tests for: ${envValues} failed.`, { context });
              process.exit(1);
            } else {
              Logger.log(`Finished tests for: ${envValues}\n\n---------------------------------------\n`, { context });
            }
          },
          (error) => {
            Logger.error(`Launcher failed to start the test ${error.stacktrace}`, { context });
            process.exit(1);
          },
        );
    }
  }
}

module.exports = wdioRunner;
