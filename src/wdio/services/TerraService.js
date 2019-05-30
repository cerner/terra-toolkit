import chai from 'chai';
import axeCommand from './TerraCommands/axe-command';
import chaiMethods from './TerraCommands/chai-methods';
<<<<<<< HEAD
import accessibility from './TerraCommands/accessibility';
=======
import accessibility from './TerraCommands/accessiblity';
>>>>>>> master
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
<<<<<<< HEAD
  before(capabilities) {
    /* Add Terra's custom Wdio command for a11y testing. */
    global.browser.addCommand('axe', axeCommand);

=======
  before() {
>>>>>>> master
    /* Initialize the Chai assertion library to have more expressive tests. */
    chai.config.showDiff = false;
    global.expect = chai.expect;
    global.should = chai.should();

    /* Add Terra's custom Chai assertion helpers for a11y & VR testing. */
    chai.Assertion.addMethod('accessible', chaiMethods.accessible);
    chai.Assertion.addMethod('matchReference', chaiMethods.matchReference);

    /* Add a Terra global with access to Mocha-Chai test helpers. */
    global.Terra = {
      /* `viewports` provides access Terra's list of test viewports. */
      viewports: viewportHelpers.getViewports,

      /* `describeViewports` provides a custom Mocha `describe` block for looping test viewports. */
      describeViewports: viewportHelpers.describeViewports,

<<<<<<< HEAD
      /* `validates` provides access to the chai assertions to use in Mocha `it` blocks. */
      validates: {
        accessibility: accessibility.validatesAccessibility,
=======

      /* `should` provides access to Mocha it blocks of test assertions. */
      should: {
        beAccessible: accessibility.itIsAccessible,
        matchScreenshot: visualRegression.itMatchesScreenshot,
        themeEachCustomProperty: visualRegression.themeEachCustomProperty,
        themeCombinationOfCustomProperties: visualRegression.themeCombinationOfCustomProperties,
        validateElement: validateElement.itValidatesElement,
      },

      /* `validates` provides access to the chai assertions to use in Mocha `it` blocks. */
      validates: {
        accessibility: accessibility.runAccessibilityTest,
>>>>>>> master
        screenshot: visualRegression.validatesScreenshot,
        element: validateElement.validatesElement,
      },

      /* `it` provides access to Mocha it blocks of test assertions. */
      it: {
        isAccessible: accessibility.itIsAccessible,
        matchesScreenshot: visualRegression.itMatchesScreenshot,
        validatesElement: validateElement.itValidatesElement,
      },
    };

    /* IE driver takes a longer to be ready for browser interactions. */
<<<<<<< HEAD
    if (capabilities.browserName === 'internet explorer') {
=======
    if (global.browser.desiredCapabilities.browserName === 'internet explorer') {
>>>>>>> master
      global.browser.pause(10000);
    }

    /* Set the viewport size before the spec begins.  */
    viewportHelpers.setViewport(global.browser.options.formFactor);
<<<<<<< HEAD
=======
  }

  // eslint-disable-next-line class-methods-use-this
  onComplete() {
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.matchScreenshot to Terra.it.matchesScreenshot.`, { context: '[Terra-Toolkit:terra-service]' });
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.beAccessible to Terra.it.isAccessible.`, { context: '[Terra-Toolkit:terra-service]' });
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.validateElement to Terra.it.validatesElement.`, { context: '[Terra-Toolkit:terra-service]' });
>>>>>>> master
  }
}
