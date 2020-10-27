/* eslint-disable class-methods-use-this */
const expect = require('expect');
const { accessibility } = require('../commands/validates');
const { toBeAccessible } = require('../commands/expect');

class TerraService {
  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before() {
    global.expect = expect;
    global.expect.extend({ toBeAccessible });

    global.Terra = {};
    global.Terra.validates = { accessibility };
  }
}

module.exports = TerraService;
