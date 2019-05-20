import determineOptions from './determine-test-options';

/**
 * The actual it block for running axe and validating no accesibilty violations were found.
 * @param {Object} options - The Axe options. Available options are viewports,
 * rules, and contex.
 */
const accessibleItBlock = (options) => {
  global.it('is accessible', () => {
    const axeResults = global.browser.axe(options);
    global.expect(axeResults).to.be.accessible();
  });
};

/**
* A mocha-chai convenience test case to assert assesiblity.
* @param {Object} options - The Axe options. Available options are viewports,
* rules, and contex. See https://www.axe-core.org/docs/.
*/
const beAccessible = (...args) => {
  accessibleItBlock(determineOptions.axeOptions(args));
};

const methods = {
  accessibleItBlock,
  beAccessible,
};

export default methods;
