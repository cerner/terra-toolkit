const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio]' });

module.exports = () => {
  logger.info('package-json-lint execution placeholder');
};
