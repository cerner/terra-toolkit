import chai from 'chai';
import axeCommand from './TerraCommands/axe-command';
import chaiMethods from './TerraCommands/chai-methods';
import accessibility from './TerraCommands/accessibility';
import themeCustomProperties from './TerraCommands/theme-custom-properties';
import visualRegression from './TerraCommands/visual-regression';
import validateElement from './TerraCommands/validate-element';
import viewportHelpers from './TerraCommands/viewport-helpers';
import Logger from '../../../scripts/utils/logger';

/**
* Webdriver.io TerraService
* Provides global access to chia, as well as custom chai assertions.
* Also provides access a global instance of the Terra object which
* provides accessibility and visual regression test steps.
*/
export default class TerraService {
  // eslint-disable-next-line class-methods-use-this
  onPrepare(config) {
    Logger.log(`Running tests against ${Logger.emphasis(`Selenium ${config.seleniumVersion}`)}`, { context: '[Terra-Toolkit:terra-service]' });
  }

  // eslint-disable-next-line class-methods-use-this
  before(capabilities) {
    global.browser.addCommand('axe', axeCommand);
    chai.config.showDiff = false;
    global.expect = chai.expect;
    global.should = chai.should();
    global.Terra = {
      viewports: viewportHelpers.getViewports,

      should: {
        beAccessible: accessibility.itIsAccessible,
        matchScreenshot: visualRegression.itMatchesScreenshot,
        themeEachCustomProperty: themeCustomProperties.themeEachCustomProperty,
        themeCombinationOfCustomProperties: themeCustomProperties.themeCombinationOfCustomProperties,
        validateElement: validateElement.itValidatesElement,
      },

      validates: {
        accessibility: accessibility.validatesAccessibility,
        screenshot: visualRegression.validatesScreenshot,
        element: validateElement.validatesElement,
      },

      it: {
        isAccessible: accessibility.itIsAccessible,
        matchesScreenshot: visualRegression.itMatchesScreenshot,
        validatesElement: validateElement.itValidatesElement,
      },
    };
    chai.Assertion.addMethod('accessible', chaiMethods.accessible);
    chai.Assertion.addMethod('matchReference', chaiMethods.matchReference);
    // IE driver takes a longer to be ready for browser interactions
    if (capabilities.browserName === 'internet explorer') {
      global.browser.pause(10000);
    }
    viewportHelpers.setViewport(global.browser.options.formFactor);
  }
}
