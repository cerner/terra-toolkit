class TestService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  afterCommand(commandName, _args, _result, error) {
    if ((commandName === 'url' || commandName === 'refresh') && !error) {
      browser.execute(function test() {
        console.log('[wdio-test-service] test function');
      });
    }
  }
}

module.exports = TestService;
