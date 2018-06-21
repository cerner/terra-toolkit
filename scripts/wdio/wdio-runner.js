const { Launcher } = require('webdriverio');

async function wdioRunner(options) {
  const {
    configPath, locales, formFactors, continueOnFail, ...testSetup
  } = options;
  const factors = formFactors || [undefined];

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

      // eslint-disable-next-line no-console
      console.log(`\n> [Terra-Tookit:wdio-runner] Running tests for: ${envValues}\n`);

      // eslint-disable-next-line no-await-in-loop
      await new Launcher(configPath, testSetup)
        .run()
        .then(
          // eslint-disable-next-line no-loop-func
          (code) => {
            if (code === 1 && !continueOnFail) {
              // eslint-disable-next-line no-console
              console.error(`[Terra-Tookit:wdio-runner] Running tests for: ${envValues} failed.`);
              process.exit(1);
            }
          },
          (error) => {
            // eslint-disable-next-line no-console
            console.error('Launcher failed to start the test', error.stacktrace);
            process.exit(1);
          },
        );
    }
  }
}

module.exports = wdioRunner;
