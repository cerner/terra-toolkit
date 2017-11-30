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

const matchScreenshot = (param1, param2) => {
  let name = 'default';
  let options = {};
  if (typeof param1 === 'string') {
    name = param1;
    options = param2 || options;
  } else {
    options = param1 || options;
  }

  const selector = options.selector || '[data-reactroot]';
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
      },
    };
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }
}
