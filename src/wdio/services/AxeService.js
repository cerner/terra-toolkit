/* global browser, axe */
import fs from 'fs';

let axeCoreSrc = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
axeCoreSrc = axeCoreSrc.replace(/^\/\*.*\*\//, '');

export default class AxeService {
  before() {
    browser.addCommand('axe', (options) => {
      if (browser.execute('return window.axe === undefined;')) {
        browser.execute(axeCoreSrc);
      }

      const currentViewportSize = browser.getViewportSize();
      const viewports = options.viewports;
      const axeOptions = {
        runOnly: options.runOnly,
        rules: options.rules,
      };

      if (viewports.length === 0) {
        viewports.push(currentViewportSize);
      }

      const results = options.viewports.map((viewport) => {
        browser.setViewportSize(viewport);
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
