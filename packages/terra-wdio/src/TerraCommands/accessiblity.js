import fs from 'fs';
import SERVICE_DEFAULTS from '../../config/services.default-config';

const axe = (options = {}) => {
  let axeCoreSrc;
  
  const axeConfig = {
    ...SERVICE_DEFAULTS.axe,
    ...(global.browser.options.axe || {}),
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
          axeOptions.restoreScroll = true;
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
      axe.run(context || document, opts, function (error, result) {
        /* eslint-disable-next-line object-shorthand */
        done({ error: error, result: result });
      });
    }, wdioContext, wdioOptions);

    return axeResult.value;
  };

  let results;
  const specifiedViewports = options.viewports;
  const axeOptions = {
    runOnly: options.runOnly,
    rules: options.rules,
    // restoreScroll: true,
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
};

/**
* A mocha-chai convenience test case to assert assesiblity.
* @property {Object} options - The Axe options. Available options are viewports,
* rules, runOnly, and contex. See https://www.axe-core.org/docs/.
*/
const beAccessible = (options) => {
  global.it('is accessible', () => {
    global.expect(global.browser.axe(options)).to.be.accessible();
  });
};

const methods = {
  axe,
  beAccessible,
};

export default methods;
