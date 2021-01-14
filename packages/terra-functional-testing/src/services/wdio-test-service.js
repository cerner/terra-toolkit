const { setApplicationLocale } = require('../commands/utils');

class TestService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  afterCommand(commandName, _args, _result, error) {
    console.log(`Terra setApplicationLocale: ${JSON.stringify(global.Terra.setApplicationLocale)}`);
    if ((commandName === 'url' || commandName === 'refresh') && !error) {
      setApplicationLocale('ar');
    }
  }
}

module.exports = TestService;
