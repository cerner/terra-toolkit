/* global browser, axe */
import fs from 'fs';

let axeCoreSrc;

/**
* Webdriver.io AxeService
* provides the browser.axe() command.
*/
export default class AxeService {
  // eslint-disable-next-line class-methods-use-this
  before(config) {
    const axeConfig = {
      inject: true, // True if axeCore script should be injected on each test page.
      ...(config.axe || {}),
    };

    browser.addCommand('axe', (options = {}) => {
      // Conditionally inject axe. This allows consumers to inject it themselves
      // in the test examples which would slightly speed up test runs.
      if (axeConfig.inject) {
        if (browser.execute('return window.axe === undefined;')) {
          if (!axeCoreSrc) {
            axeCoreSrc = fs.readFileSync(require.resolve('axe-core'), 'utf8');
            axeCoreSrc = axeCoreSrc.replace(/^\/\*.*\*\//, '');
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
