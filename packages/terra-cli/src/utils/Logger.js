const log = require('npmlog');

class Logger {
  constructor(options) {
    const { prefix } = options;

    this.prefix = prefix;
  }
}

Object.keys(log.levels).forEach((level) => {
  Logger.prototype[level] = function logMessage(message) {
    const oldHeading = log.heading;
    log.heading = 'terra';
    log[level](this.prefix, message);
    log.heading = oldHeading;
  };
});

module.exports = Logger;
