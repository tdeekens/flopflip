const colors = require('colors/safe');

const shouldSilenceWarnings = (...messages) =>
  [].some((msgRegex) => messages.some((msg) => msgRegex.test(msg)));

const shouldNotThrowWarnings = (...messages) =>
  [].some((msgRegex) => messages.some((msg) => msgRegex.test(msg)));

const logOrThrow = (log, method, messages) => {
  const warning = `console.${method} calls not allowed in tests`;

  if (!process.env.CI) {
    log(colors.bgYellow.black(' WARN '), warning, '\n', ...messages);
    return;
  }

  if (shouldSilenceWarnings(messages)) {
    return;
  }

  log(warning, '\n', ...messages);

  // NOTE: That some warnings should be logged allowing us to refactor graceully
  // without having to introduce a breaking change.
  if (shouldNotThrowWarnings(messages)) {
    return;
  }

  throw new Error(...messages);
};

const logMessage = console.log;
global.console.log = (...messages) => {
  logOrThrow(logMessage, 'log', messages);
};

const logInfo = console.info;
global.console.info = (...messages) => {
  logOrThrow(logInfo, 'info', messages);
};

const logWarning = console.warn;
global.console.warn = (...messages) => {
  logOrThrow(logWarning, 'warn', messages);
};

const logError = console.error;
global.console.error = (...messages) => {
  logOrThrow(logError, 'error', messages);
};
