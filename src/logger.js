const chalk = require('chalk');

const messageDetails = (details) => {
  if (typeof details !== 'object') {
    return { message: details };
  }

  return { context: details.context, message: details.message || '' };
};

const getMessage = (details, color) => {
  const { context, message } = messageDetails(details);
  let logMessage = '';

  if (context) {
    logMessage += `${chalk.bold.dim(context)} `;
  }
  logMessage += chalk[color](message);

  return logMessage;
};

const consoleError = details => (
  new Error(getMessage(details, 'red'))
);

const consoleLog = details => (
  /* eslint-disable-next-line no-console */
  console.log(getMessage(details, 'grey'))
);

const consoleWarn = details => (
  /* eslint-disable-next-line no-console */
  console.warn(getMessage(details, 'magenta'))
);

module.exports = {
  consoleError, consoleLog, consoleWarn, chalk,
};
