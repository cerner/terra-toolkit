import chai from 'chai';
import chaiMethods from './TerraCommands/chai-methods';
import accessibility from './TerraCommands/accessiblity';
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
  before() {
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
    if (global.browser.desiredCapabilities.browserName === 'internet explorer') {
      global.browser.pause(10000);
    }

    /* Set the viewport size before the spec begins.  */
    viewportHelpers.setViewport(global.browser.options.formFactor);
  }

  // eslint-disable-next-line class-methods-use-this
  onComplete() {
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.matchScreenshot to Terra.it.matchesScreenshot.`, { context: '[Terra-Toolkit:terra-service]' });
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.beAccessible to Terra.it.isAccessible.`, { context: '[Terra-Toolkit:terra-service]' });
    Logger.log(`${Logger.emphasis('Be proactive for toolkit v5!')} Update Terra.should.validateElement to Terra.it.validatesElement.`, { context: '[Terra-Toolkit:terra-service]' });
  }
}
