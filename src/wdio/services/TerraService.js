import chai from 'chai';

const VIEWPORTS = {
  tiny: { width: 470, height: 768 },
  small: { width: 622, height: 768 },
  medium: { width: 838, height: 768 },
  large: { width: 1000, height: 768 },
  huge: { width: 1300, height: 768 },
  enormous: { width: 1500, height: 768 },
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

const resize = (...args) => {
  const test = args.slice(-1)[0];
  const viewportSizes = args.slice(0, -1);

  if (typeof test !== 'function') {
    throw new Error('The last argument must be a function');
  }

  viewportSizes.forEach((name) => {
    global.browser.setViewportSize(VIEWPORTS[name]);
    test(name, VIEWPORTS[name]);
  });
};

const should = {
  beAccessible(options) {
    global.it('is accessible', () => {
      global.expect(global.browser.axe(options)).to.be.accessible();
    });
  },

  beComparable({ name = 'default', css = '[data-reactroot]', viewports = {} }) {
    global.it(`[${name}] checks visual comparison`, () => {
      const screenshots = global.browser.checkElement(css, { viewports });
      global.expect(screenshots).to.matchReference();
    });
  },
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
      resize,
      should,
    };
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }
}
