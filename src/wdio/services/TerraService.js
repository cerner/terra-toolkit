import chai from 'chai';

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

function matchReference() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);
  // eslint-disable-next-line no-underscore-dangle
  this.assert(this._obj.every(src => src.isExactSameImage),
    'expected screenshots to match reference',
    'expected screenshots to not match reference');
}

const viewport = (...sizes) => {
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


export default class TerraService {
  before() {
    global.expect = chai.expect;
    global.viewport = viewport;
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }
}
