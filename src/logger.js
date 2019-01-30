const chalk = require('chalk');

class Logger {
  static format(style, message) {
    if (chalk[style] !== undefined) {
      return chalk[style](message);
    }
    return message;
  }

  static setContext(context) {
    if (context) {
      return `${this.format('bold', this.format('dim', context))} `;
    }

    return '';
  }

  static getDetails(details) {
    return { context: this.setContext((details || {}).context) };
  }

  static getMessage(message, details, color) {
    const { context } = this.getDetails(details);

    return context + this.format(color, message);
  }

  static emphasis(message) {
    return this.format('bold', this.format('cyan', message));
  }

  static log(message, details) {
    /* eslint-disable-next-line no-console */
    console.warn(this.getMessage(message, details, 'grey'));
  }

  static warn(message, details) {
    /* eslint-disable-next-line no-console */
    console.log(this.getMessage(message, details, 'yellow'));
  }

  static error(message, details) {
    return new Error(this.getMessage(message, details, 'red'));
  }
}

module.exports = Logger;
