const chalk = require('chalk');

class Logger {
  static format(style, message) {
    if (chalk[style] !== undefined) {
      return chalk[style](message);
    }
    return message;
  }

  static getMessageDetails(details) {
    if (typeof details !== 'object') {
      return { message: details };
    }
    return { context: details.context, message: details.message || '' };
  }

  static getMessage(details, color) {
    const { context, message } = this.getMessageDetails(details);
    let logMessage = '';

    if (context) {
      logMessage += `${this.format('bold', this.format('dim', context))} `;
    }
    logMessage += this.format(color, message);

    return logMessage;
  }

  static emphasis(message) {
    return this.format('bold', this.format('cyan', message));
  }

  static log(details) {
    /* eslint-disable-next-line no-console */
    console.warn(this.getMessage(details, 'grey'));
  }

  static warn(details) {
    /* eslint-disable-next-line no-console */
    console.log(this.getMessage(details, 'yellow'));
  }

  static error(details) {
    return new Error(this.getMessage(details, 'red'));
  }
}

module.exports = Logger;
