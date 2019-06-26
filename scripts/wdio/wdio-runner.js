const { Launcher } = require('webdriverio');
const Logger = require('../utils/logger');

const context = '[Terra-Tookit:wdio-runner]';

async function wdioRunner(options) {
  const {
    configPath, locales, formFactors, gridUrl, browsers, continueOnFail, ...testSetup
  } = options;

  const testlocales = locales || ['en'];
  const factors = formFactors || [undefined];

  if (gridUrl) {
    process.env.SELENIUM_GRID_URL = gridUrl;
  }

  if (browsers) {
    process.env.BROWSERS = browsers;
  }

  function onReturnSuccess(doExit, envValues) {
    if (!doExit) {
      Logger.log(`Finished tests for: ${envValues}\n\n---------------------------------------\n`, { context });
    } else {
      process.exit(0);
    }
  }

  for (let localeI = 0; localeI < testlocales.length; localeI += 1) {
    const locale = testlocales[localeI];
    process.env.LOCALE = locale;

    for (let factor = 0; factor < factors.length; factor += 1) {
      let envValues = `LOCALE=${locale} `;
      let exitProcess = false;
      process.on('SIGINT', () => {
        exitProcess = true;
        return exitProcess;
      });

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
            if (code === 1 && !continueOnFail && !exitProcess) {
              Logger.error(`Running tests for: ${envValues} failed.`, { context });
              process.exit(1);
            } else {
              onReturnSuccess(exitProcess, envValues);
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
