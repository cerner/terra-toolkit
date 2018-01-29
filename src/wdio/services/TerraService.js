import chai from 'chai';

const VIEWPORTS = {
  tiny: { width: 470, height: 768, name: 'tiny' },
  small: { width: 622, height: 768, name: 'small' },
  medium: { width: 838, height: 768, name: 'medium' },
  large: { width: 1000, height: 768, name: 'large' },
  huge: { width: 1300, height: 768, name: 'huge' },
  enormous: { width: 1500, height: 768, name: 'enormous' },
};


/**
* accessible chai assertion to be paired with browser.axe() tests.
*/
function accessible() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);
  // eslint-disable-next-line no-underscore-dangle
  const errors = this._obj
    .filter(test => test.result)
    .reduce((all, test) => all.concat(test.result.violations), [])
    .filter(test => test)
    .map(test => `${JSON.stringify(test, null, 4)}`);

  this.assert(errors.length === 0,
    `expected no accessibility violations but got:\n\t${errors[0]}`,
    'expected accessibilty errors but received none');
}

/**
* matchReference chai assertion to be paired with browser.capture()
* visual regression tests.
*/
function matchReference() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);

  // eslint-disable-next-line no-underscore-dangle
  this.assert(this._obj.every(src => (src && src.isExactSameImage)),
    'expected screenshots to match reference',
    'expected screenshots to not match reference');
}

/**
* convenience method for getting viewports by name
* @param sizes - [String] of viewport sizes.
* @return [Object] of viewport sizes.
*/
const getViewports = (...sizes) => {
  let viewportSizes = Object.keys(VIEWPORTS);
  if (sizes.length) {
    viewportSizes = sizes;
  }
  return viewportSizes.map(size => VIEWPORTS[size]);
};

const beAccessible = (options) => {
  global.it('is accessible', () => {
    global.expect(global.browser.axe(options)).to.be.accessible();
  });
};


/**
* Generates a test for each themed property given and runs a screenshot assertion.
* @property {Array} args - An object containing the CSS custom properties to assert.
*/
const themeEachCustomProperty = (...args) => {
  // If more than 1 argument, selector is first
  const selector = args.length > 1 ? args[0] : global.browser.options.terra.selector;
  // Style properties are always last.
  const styleProperties = args[args.length - 1];

  Object.entries(styleProperties).forEach(([key, value]) => {
    global.it(`themed [${key}]`, () => {
      global.browser.execute(`document.documentElement.style.setProperty('${key}', '${value}')`);
      global.expect(global.browser.checkElement(selector)).to.matchReference();
    });
  });
};

const matchScreenshot = (...args) => {
  const param1 = args.length ? args[0] : undefined;
  const param2 = args.length > 1 ? args[1] : undefined;

  let name = 'default';
  let options = {};
  if (typeof param1 === 'string') {
    name = param1;
    options = typeof param2 === 'object' && !Array.isArray(param2) ? param2 : options;
  } else {
    options = typeof param1 === 'object' && !Array.isArray(param1) ? param1 : options;
  }

  const selector = options.selector || global.browser.options.terra.selector;
  const viewports = options.viewports || [];

  global.it(`[${name}] matches screenshot`, () => {
    const screenshots = global.browser.checkElement(selector, { viewports });
    global.expect(screenshots).to.matchReference();
  });
};


/**
* Webdriver.io AxeService
* provides custom chai assertoins.
*/
export default class TerraService {
  // eslint-disable-next-line class-methods-use-this
  before() {
    global.expect = chai.expect;
    global.Terra = {
      viewports: getViewports,
      should: {
        beAccessible,
        matchScreenshot,
        themeEachCustomProperty,
      },
    };
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }
}
