class TestService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  afterCommand(commandName, _args, _result, error) {
    console.log(`Terra global: ${JSON.stringify(global.Terra)}`);
    if ((commandName === 'url' || commandName === 'refresh') && !error) {
      global.Terra.setApplicationLocale('ar');
    }
  }
}

module.exports = TestService;
