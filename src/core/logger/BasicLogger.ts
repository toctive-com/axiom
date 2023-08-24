import { uuidv7 } from 'uuidv7';
import { LogDetails } from './LogDetails';
import { LogLevel, logLevels } from './LogLevel';
import { LoggerArguments } from './LoggerArguments';
import { LoggerConfig } from './LoggerConfig';
import { LogFormatter } from './formatters/LogFormatter';
import { ConsoleTransport } from './transports';
import { LogTransport } from './transports/LogTransport';

/**
 * BasicLogger is a class that provides basic logging functionality with
 * customizable configuration. It supports different log levels, formatters, and
 * transports for handling log messages.
 */
export class BasicLogger {
  protected config: Partial<LoggerConfig>;
  protected transports: LogTransport[];
  protected formatters: LogFormatter[];

  /**
   * Creates an instance of BasicLogger with optional configuration arguments.
   * @param args An optional LoggerArguments object containing configuration
   * settings for the logger.
   */
  constructor(args?: LoggerArguments) {
    this.formatters = args?.formatters || [];
    this.transports = args?.transports || [new ConsoleTransport()];

    this.config = {
      logLevel: logLevels.Debug,
      ...(args?.config || {}),
    };
  }

  /**
   * Checks if a log message with the given level should be logged based on the
   * logger's configuration.
   * @param level The log level of the message.
   * @returns True if the message should be logged, otherwise false.
   */
  protected shouldLog(level: LogLevel): boolean {
    return !this.config.silent && level <= this.config.logLevel;
  }

  /**
   * Generates a UTC timestamp for log messages.
   * @returns A string representation of the UTC timestamp.
   */
  protected generateTimestamp(): string {
    return new Date().toUTCString();
  }

  /**
   * Generates a UUIDv7 message ID for log messages.
   * @returns A string containing the generated UUID.
   */
  protected generateMessageId(): string {
    return uuidv7();
  }

  /**
   * Combines the output of log formatters to create a formatted log message.
   * @param logDetails The details of the log message.
   * @returns The formatted log message as a string.
   */
  protected combineFormatters(logDetails: LogDetails): string {
    return this.formatters.reduce((formattedMessage, formatter) => {
      return formatter.format({ ...logDetails, message: formattedMessage });
    }, logDetails.rawMessage);
  }

  /**
   * Logs a message with the specified log level, optional data, and performs
   * log transportation.
   * @param level The log level of the message.
   * @param message The main content of the log message.
   * @param data Additional data to be included in the log message.
   */
  async log(level: LogLevel, message: string, data?: Object): Promise<void> {
    if (!this.shouldLog(level)) return;

    const timestamp = this.generateTimestamp();
    const messageId = this.generateMessageId();

    const formattedMessage = this.combineFormatters({
      rawMessage: message,
      message,
      messageId,
      timestamp,
      level,
      ...(data || {}),
    });

    const promises = this.transports.map((transport) => {
      return new Promise((resolve, reject) => {
        transport
          .log({
            message: formattedMessage,
            rawMessage: message,
            messageId,
            timestamp,
            level,
          })
          .then(resolve)
          .catch(reject);
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('An error occurred while calling transports:', error);
    }
  }

  // Methods for logging messages at different log levels

  async emergency(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Emergency, message, data);
  }

  async alert(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Alert, message, data);
  }

  async critical(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Critical, message, data);
  }

  async error(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Error, message, data);
  }

  async warning(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Warning, message, data);
  }

  async notice(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Notice, message, data);
  }

  async info(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Info, message, data);
  }

  async debug(message: string, data?: Object): Promise<void> {
    await this.log(logLevels.Debug, message, data);
  }
}
