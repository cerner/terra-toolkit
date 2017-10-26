/* global browser, axe */
import chai from 'chai';
import fs from 'fs';

let axeCoreSrc = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
axeCoreSrc = axeCoreSrc.replace(/^\/\*.*\*\//, '');

export default class TerraLauncher {
  before() {
    global.expect = chai.expect;
    chai.Should();

    // TODO: Move into toolkit
    chai.Assertion.addMethod('matchReference', function () {
      // eslint-disable-next-line no-underscore-dangle
      new chai.Assertion(this._obj).to.be.instanceof(Array);
      // eslint-disable-next-line no-underscore-dangle
      this.assert(this._obj.every(scr => scr.isExactSameImage),
        'expected screenshots to match reference',
        'expected screenshots to not match reference');
    });

    chai.Assertion.addMethod('accessible', function () {
      // eslint-disable-next-line no-underscore-dangle
      new chai.Assertion(this._obj).to.be.instanceof(Array);
      // eslint-disable-next-line no-underscore-dangle
      const errors = this._obj
        .reduce((all, test) => all.concat(test.result.violations), [])
        .filter(test => test)
        .map(test => `${JSON.stringify(test, null, 4)}`);

      this.assert(errors.length === 0,
        `expected no accessibility violations but got:\n\t${errors[0]}`,
        'expected accessibilty errors but received none');
    });

    global.viewport = (...sizes) => {
      const widths = {
        tiny: { width: 470, height: 768 },
        small: { width: 622, height: 768 },
        medium: { width: 838, height: 768 },
        large: { width: 1000, height: 768 },
        huge: { width: 1300, height: 768 },
        enormous: { width: 500, hegiht: 768 },
      };

      if (sizes.length === 0) {
        return global.viewport('tiny', 'small', 'medium', 'large', 'huge');
      }

      return sizes.map(size => widths[size]);
    };

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
};
