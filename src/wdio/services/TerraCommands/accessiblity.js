/**
* A mocha-chai convenience test case to assert assesiblity.
* @param {Object} options - The Axe options. Available options are viewports,
* rules, and contex. See https://www.axe-core.org/docs/.
*/
const beAccessible = (options) => {
  global.it('is accessible', () => {
    const axeOptions = {
      context: global.browser.options.terra.selector,
      ...options,
    };
    global.expect(global.browser.axe(axeOptions)).to.be.accessible();
  });
};

const methods = {
  beAccessible,
};

export default methods;
