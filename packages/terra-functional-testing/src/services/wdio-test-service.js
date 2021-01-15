// const { setApplicationLocale } = require('../commands/utils');

class TestService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  afterCommand(commandName, _args, _result, error) {
    if ((commandName === 'url' || commandName === 'refresh') && !error) {
      // Terra.setApplicationLocale('de');
    }
  }
}

module.exports = TestService;
