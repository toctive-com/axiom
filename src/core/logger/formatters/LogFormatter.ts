import { LogDetails } from '../LogDetails';

/**
 * LogFormatter is an abstract class that provides a base structure for log
 * message formatting. Subclasses of this class can implement custom formatting
 * logic for log entries.
 */
export abstract class LogFormatter {
  /**
   * format is a method that takes log details and returns a formatted log
   * message as a string. This method can be overridden by subclasses to
   * implement specific formatting strategies.
   *
   * @param logDetails An object containing log-related details like level,
   * messageId, message, and timestamp.
   * @returns A formatted log message as a string.
   */
  format(logDetails: LogDetails): string {
    // By default, this method returns the unmodified log message.
    return logDetails.message;
  }
}
