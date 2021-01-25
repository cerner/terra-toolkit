// const { setApplicationLocale } = require('../commands/utils');

class TestService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  afterCommand(commandName, _args, _result, error) {
    if ((commandName === 'url' || commandName === 'refresh') && !error) {
      // IE driver takes longer to be ready for browser interactions.
      // if (global.browser.capabilities.browserName === 'internet explorer') {
      //   global.browser.$('body').waitForExist({
      //     timeout: global.browser.config.waitforTimeout,
      //     interval: 100,
      //   });
      // }
      browser.execute(function test() {
        console.log('[wdio-terra-service] test function');
      });
    }
  }
}

module.exports = TestService;
