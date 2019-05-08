import determineOptions from './determine-test-options';

/**
* A mocha-chai convenience test case to assert assesiblity.
* @property {Object} options - The Axe options. Available options are viewports,
* rules, runOnly, and contex. See https://www.axe-core.org/docs/.
*/
const beAccessible = (...args) => {
  global.it('is accessible', () => {
    const options = determineOptions.axeOptions(args);
    global.expect(global.browser.axe(options)).to.be.accessible();
  });
};

const methods = {
  beAccessible,
};

export default methods;
