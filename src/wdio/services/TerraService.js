import chai from 'chai';
import chaiMethods from './TerraCommands/chai-methods';
import accessiblity from './TerraCommands/accessiblity';
import visualRegression from './TerraCommands/visual-regression';

/**
* Terra defined viewport sizes.
*/
const VIEWPORTS = {
  tiny: { width: 470, height: 768, name: 'tiny' },
  small: { width: 622, height: 768, name: 'small' },
  medium: { width: 838, height: 768, name: 'medium' },
  large: { width: 1000, height: 768, name: 'large' },
  huge: { width: 1300, height: 768, name: 'huge' },
  enormous: { width: 1500, height: 768, name: 'enormous' },
};

/**
* Convenience method for getting viewports by name.
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

/**
* Webdriver.io TerraService
* Provides global access to chia, as well as custom chai assertions.
* Also provides access a global instance of the Terra object which
* provides accessibliy and visual regression test steps.
*/
export default class TerraService {
  // eslint-disable-next-line class-methods-use-this
  before() {
    chai.config.showDiff = false;
    global.expect = chai.expect;
    global.should = chai.should();
    global.Terra = {
      viewports: getViewports,
      should: {
        beAccessible: accessiblity.beAccessible,
        matchScreenshot: visualRegression.matchScreenshotWithinTolerance,
        themeEachCustomProperty: visualRegression.themeEachCustomProperty,
      },
    };
    chai.Assertion.addMethod('accessible', chaiMethods.accessible);
    chai.Assertion.addMethod('matchReference', chaiMethods.matchReference);
  }
}
