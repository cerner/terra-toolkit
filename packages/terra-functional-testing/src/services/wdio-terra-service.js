/* eslint-disable class-methods-use-this */
const axe = require('../commands/run-axe');

class TerraService {
  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before() {
    global.browser.addCommand('axe', axe);
  }
}

module.exports = TerraService;
