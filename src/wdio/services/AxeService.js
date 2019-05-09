/* global browser, axe */
import fs from 'fs';
import SERVICE_DEFAULTS from '../../../config/wdio/services.default-config';

let axeCoreSrc;

/**
* Webdriver.io AxeService
* provides the browser.axe() command.
*/
export default class AxeService {
  // eslint-disable-next-line class-methods-use-this
  before() {
    browser.addCommand('axe', (options = {}) => {
      const axeConfig = {
        ...SERVICE_DEFAULTS.axe,
        ...(browser.options.axe || {}),
      };

      // Conditionally inject axe. This allows consumers to inject it themselves
      // in the test examples which would slightly speed up test runs.
      if (axeConfig.inject) {
        if (browser.execute('return window.axe === undefined;')) {
          if (!axeCoreSrc) {
            axeCoreSrc = fs.readFileSync(require.resolve('axe-core'), 'utf8');
            axeCoreSrc = axeCoreSrc.replace(/^\/\*.*\*\//, '');

            const axeOptions = axeConfig.options;
            if (axeOptions) {
              const axeJsonConfigure = `axe.configure(${JSON.stringify(axeOptions)})`;
              axeCoreSrc = `${axeCoreSrc}\n${axeJsonConfigure};`;
            }
          }
          browser.execute(axeCoreSrc);
        }
      }

      const runAxeTest = (wdioContext, wdioOptions) => {
        // Avoid arrow callback syntax as this function is injected into the browser
        // eslint-disable-next-line func-names, prefer-arrow-callback
        const axeResult = browser.executeAsync(function (context, opts, done) {
        // eslint-disable-next-line func-names, prefer-arrow-callback
          axe.run(context, opts, function (error, result) {
            /* eslint-disable-next-line object-shorthand */
            done({ error: error, result: result });
          });
        }, wdioContext, wdioOptions);

        return axeResult.value;
      };

      let results;
      const specifiedViewports = options.viewports;
      const axeOptions = {
        rules: options.rules,
        restoreScroll: true,
      };

      // analyze the specified viepworts
      if (specifiedViewports) {
        // get the current viewport
        const currentViewportSize = browser.getViewportSize();

        // Get accessibility results for each viewport size
        results = specifiedViewports.map((viewport) => {
          browser.setViewportSize(viewport);
          return runAxeTest(options.context, axeOptions);
        });

        // reset viewport back to the current viewport
        browser.setViewportSize(currentViewportSize);

        return results;
      }

      // analyze the current viewport
      return [runAxeTest(options.context, axeOptions)];
    });
  }
}
