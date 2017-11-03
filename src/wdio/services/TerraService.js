import chai from 'chai';

/**
* accessible chai assertion to be paired with browser.axe() tess.
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
  this.assert(this._obj.every(src => src.isExactSameImage),
    'expected screenshots to match reference',
    'expected screenshots to not match reference');
}

/**
* convenience method for getting viewports by name
* @param sizes - [String] of viewport sizes.
* @return [Object] of viewport sizes.
*/
const viewport = (...sizes) => {
  const widths = {
    tiny: { width: 470, height: 768 },
    small: { width: 622, height: 768 },
    medium: { width: 838, height: 768 },
    large: { width: 1000, height: 768 },
    huge: { width: 1300, height: 768 },
    enormous: { width: 1500, height: 768 },
  };

  if (sizes.length === 0) {
    return global.viewport('tiny', 'small', 'medium', 'large', 'huge');
  }

  return sizes.map(size => widths[size]);
};


/**
* Webdriver.io AxeService
* provides custom chai assertoins.
*/
export default class TerraService {
  // eslint-disable-next-line class-methods-use-this
  before() {
    global.expect = chai.expect;
    global.viewport = viewport;
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }
}
