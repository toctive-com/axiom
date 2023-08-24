import { BasicLogger } from './BasicLogger';
import { LogLevel } from './LogLevel';
import { LoggerArguments } from './LoggerArguments';
import { LoggerAdapter, WinstonLoggerAdapter } from './adapters';

/**
 *
 * Logger is a class that extends the functionality of the BasicLogger class to
 * include support for external loggers. It provides a mechanism to log messages
 * using both the internal logger and external logger adapters.

 * The Logging System is a versatile and extensible logging solution built in
 * TypeScript for JavaScript applications. It allows developers to log messages
 * at different log levels, apply customizable formatters for message
 * formatting, and use various transports to store or output log messages to
 * different destinations.
 *
 * ## Features
 *
 * - Support for logging messages at different log levels, such as `Emergency`,
 *   `Alert`, `Error`, `Info`, and more.
 * - Customizable log formatters for formatting log messages according to
 *   different requirements.
 * - Integration with various transports including HTTP, database storage, and
 *   file storage.
 * - Structured logging with message details including timestamps, message IDs,
 *   and additional data.
 * - Designed to be flexible and easily extendable to meet specific logging
 *   needs.
 *
 * ## Usage
 *
 * 1. Import the necessary modules and create instances of transports and
 *    formatters.
 *
 * ```typescript
 * import { Logger, HttpTransport, ColoredConsoleFormatter } from '@toctive/axiom';
 *
 * const httpTransport = new HttpTransport('http://example.com/logs');
 * const coloredConsoleFormatter = new ColoredConsoleFormatter();
 *
 * const logger = new Logger([httpTransport], [coloredConsoleFormatter]);
 * ```
 *
 * 2. Use the logger to log messages at different log levels.
 *
 * ```typescript
 * logger.info('This is an informational message.', { additionalData: 'some data' });
 * logger.error('An error occurred.', { errorCode: 500 });
 * ```
 *
 * 3. Customize the formatters and transports according to your requirements.
 *
 * ## Formatters
 *
 * Formatters are responsible for formatting log messages before they are passed
 * to transports. The Logging System includes a `ColoredConsoleFormatter` for
 * console output. You can create your own custom formatters by implementing the
 * `LogFormatter` interface.
 *
 * ## Transports
 *
 * Transports determine where the log messages will be sent. The system supports
 * various transports including HTTP, database storage, and file storage. You
 * can create custom transports by implementing the `LogTransport` interface.
 *
 * ## Examples
 *
 * - Sending logs to an HTTP endpoint:
 *
 * ```typescript
 * import { HttpTransport } from '@toctive/axiom';
 *
 * const httpTransport = new HttpTransport('http://example.com/logs');
 * const logger = new Logger([httpTransport], []);
 * ```
 *
 * - Using a custom formatter and writing logs to a file:
 *
 * ```typescript
 * import { FileTransport, LogFormatter } from '@toctive/axiom';
 *
 * class MyCustomFormatter implements LogFormatter {
 *   format(level, message, logDetails) {
 *     // Customize formatting here
 *     return `[${level}] ${message}`;
 *   }
 * }
 *
 * const fileTransport = new FileTransport('path/to/logs.log');
 * const customFormatter = new MyCustomFormatter();
 * const logger = new Logger([fileTransport], [customFormatter]);
 * ```
 */
export class Logger extends BasicLogger {
  private externalLoggers: LoggerAdapter[];

  /**
   * Creates an instance of Logger with optional configuration arguments. If no
   * external loggers are provided, it initializes an array containing a default
   * external logger.
   * @param args An optional LoggerArguments object containing configuration
   * settings for the logger.
   */
  constructor(args?: LoggerArguments) {
    super(args);

    // If no external loggers are provided, initialize an array containing a
    // default external logger.
    if (!args?.externalLoggers) {
      this.externalLoggers = [new WinstonLoggerAdapter(args)];
    }
  }

  /**
   * Logs a message with the specified log level, optional data, and performs
   * log transportation using both internal and external loggers. If external
   * loggers are not provided, only the internal logger is used.
   * @param level The log level of the message.
   * @param message The main content of the log message.
   * @param data Additional data to be included in the log message.
   */
  async log(level: LogLevel, message: string, data?: Object): Promise<void> {
    // If no external loggers are provided, use the super.log method from the
    // parent class (BasicLogger).
    if (!this.externalLoggers) super.log(level, message, data);

    // If external loggers are provided, log the message using each external
    // logger.
    this.externalLoggers?.forEach(async (logger) => {
      await logger.log(level, message, data);
    });
  }
}
