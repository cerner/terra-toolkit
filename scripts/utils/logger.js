const chalk = require('chalk');

/**
 * Terra logger for consistently formatted and decorated log, warning and error messages.
 * Uses `chalk` module for decoration and gives direct access to chalk for complex message
 * styling. See chalk's docs for decoration options: https://github.com/chalk/chalk.
 */
class Logger {
  /**
   * Decorates a message with the provided options.
   * @param {string} text - The text to decorate.
   * @param {string[]} options.decorations - The chalk decoration options (bold, underline, color, etc...).
   */
  static decorateText(text, decorations = []) {
    if (!text) {
      return '';
    }

    // Apply all chalk options to the message. Bold, Color, Underline, etc...
    const decoratedText = decorations.reduce((acc, option) => chalk[option](acc), text);

    return decoratedText;
  }

  /**
   * Logs a message with emphasis decoration.
   * @param {string} message - The message to emphasis.
   */
  static emphasis(message) {
    return Logger.decorateText(message, ['bold', 'cyan']);
  }

  /**
   * Formats a message.
   * @param {string} message - The message to format.
   * @param {Object} options - The message options.
   * @param {string} options.context - The message context to prepend the message.
   * @param {string[]} options.decorations - The chalk decoration options (bold, underline, color, etc...).
   * @returns - A formatted message.
   */
  static format(message, options) {
    const { context, decorations } = options;

    const decoratedContext = Logger.decorateText(context, ['bold', 'dim']);
    const decoratedMessage = Logger.decorateText(message, decorations);

    return `${decoratedContext} ${decoratedMessage}`.trim();
  }

  /**
   * Logs a message with default decoration.
   * @param {string} message - The log message.
   * @param {Object} options - The message options.
   * @param {string} options.context - The message context to prepend the message.
   * @param {string[]} options.decorations - The chalk decoration options (bold, underline, color, etc...).
   */
  static log(message, options) {
    /* eslint-disable-next-line no-console */
    console.log(Logger.format(message, { decorations: ['grey'], ...options }));
  }

  /**
   * Logs a warning with default decoration.
   * @param {string} message - The warning message.
   * @param {Object} options - The message options.
   * @param {string} options.context - The message context to prepend the message.
   */
  static warn(message, options) {
    /* eslint-disable-next-line no-console */
    console.warn(Logger.format(message, { ...options, decorations: ['yellow'] }));
  }

  /**
   * Creates an error message with default decoration.
   * @param {string} message - The error message.
   * @param {Object} options - The message options.
   * @param {string} options.context - The message context to prepend the message.
   * @returns - A formatted error object.
   */
  static error(message, options) {
    return new Error(Logger.format(message, { ...options, decorations: ['red'] }));
  }
}

Logger.chalk = chalk;

module.exports = Logger;
