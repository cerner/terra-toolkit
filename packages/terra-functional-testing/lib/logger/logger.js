class Logger {
  constructor(options) {
    const { prefix } = options;

    this.prefix = prefix;
  }

  /**
   * Formats the text.
   * @param {string} text - The text to format.
   * @returns {string} - A formatted string.
   */
  format(text) {
    return `[terra-functional-testing:${this.prefix}] ${text}`;
  }

  /**
   * Logs the text to the console.
   * @param {string} text - The text to be logged.
   */
  log(text) {
    // eslint-disable-next-line no-console
    console.log(this.format(text));
  }
}

module.exports = Logger;
