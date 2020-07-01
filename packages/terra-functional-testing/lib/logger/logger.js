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
    this.info(text);
  }

  /**
   * Logs an info message to the console.
   * @param {string} text - The text to be logged.
   */
  info(text) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${this.format(text)}`);
  }

  /**
   * Logs a warning message to the console.
   * @param {string} text - The text to be logged.
   */
  warn(text) {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${this.format(text)}`);
  }

  /**
   * Logs an error message to the console.
   * @param {string} text - The text to be logged.
   */
  error(text) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${this.format(text)}`);
  }
}

module.exports = Logger;
