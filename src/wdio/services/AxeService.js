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
      // Conditionally inject axe. This allows consumers to inject it themselves
      // in the test examples which would slightly speed up test runs.
      const axeConfig = {
        ...SERVICE_DEFAULTS.axe,
        ...(browser.options.axe || {}),
      };
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

      const currentViewportSize = browser.getViewportSize();
      // use current viewport if none specified
      const specifiedViewports = options.viewports || [currentViewportSize];
      const axeOptions = {
        runOnly: options.runOnly,
        rules: options.rules,
      };

      // Get accessibility results for each viewport size
      const results = specifiedViewports.map((viewport) => {
        browser.setViewportSize(viewport);
        // Avoid arrow callback syntax as this function is injected into the browser
        // eslint-disable-next-line func-names, prefer-arrow-callback
        return browser.executeAsync(function (context, opts, done) {
          // eslint-disable-next-line func-names, prefer-arrow-callback
          axe.run(context || document, opts, function (error, result) {
            done({
              // eslint-disable-next-line object-shorthand
              error: error,
              // eslint-disable-next-line object-shorthand
              result: result,
            });
          });
        }, options.context, axeOptions).value;
      });

      // set viewport back
      browser.setViewportSize(currentViewportSize);
      return results;
    });
  }
}
