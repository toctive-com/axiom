/**
 * logLevels represents a set of predefined log levels along with their
 * associated numerical values.
 */
export const logLevels = {
  /**
   * Represents the most severe log level. Use for critical system failures that
   * require immediate attention.
   */
  Emergency: 0,

  /**
   * Represents a log level indicating a situation that requires swift action.
   */
  Alert: 1,

  /**
   * Represents a critical log level where a critical error has occurred.
   */
  Critical: 2,

  /**
   * Represents a log level indicating a general error.
   */
  Error: 3,

  /**
   * Represents a log level indicating a potential problem or warning.
   */
  Warning: 4,

  /**
   * Represents a log level for important notices.
   */
  Notice: 5,

  /**
   * Represents a log level providing useful information about the application's
   * state.
   */
  Info: 6,

  /**
   * Represents a log level used for debugging purposes.
   */
  Debug: 7,
} as const;

/**
 * LogLevel represents the union of all available log level strings. It can be
 * used to specify the desired log level when logging messages.
 */
export type LogLevel = (typeof logLevels)[keyof typeof logLevels];
