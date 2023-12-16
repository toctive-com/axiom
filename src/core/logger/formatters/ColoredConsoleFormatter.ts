import { LogDetails } from '../LogDetails';
import { logLevels } from '../LogLevel';
import { LogFormatter } from './LogFormatter';

/**
 * ColoredConsoleFormatter is a class that implements the LogFormatter interface
 * and provides formatted log messages with colors for different log levels.
 * It applies colors to log messages based on the severity level.
 */
export class ColoredConsoleFormatter implements LogFormatter {
  /**
   * Generates a formatted log message with colors based on the severity level.
   * @param logDetails An object containing log-related details like level,
   * messageId, message, and timestamp.
   * @returns The formatted log message as a colored string.
   */
  format({ level, message }: LogDetails): string {
    // Create the initial formatted message with level and message
    let formattedMessage = `[${Object.keys(logLevels)[level]}] ${message}`;

    // Apply color based on the severity level
    switch (level) {
      case logLevels.Emergency:
      case logLevels.Alert:
      case logLevels.Critical:
        formattedMessage = `\x1b[31m${formattedMessage}\x1b[0m`; // Red color
        break;
      case logLevels.Error:
        formattedMessage = `\x1b[91m${formattedMessage}\x1b[0m`; // Light red color
        break;
      case logLevels.Warning:
        formattedMessage = `\x1b[33m${formattedMessage}\x1b[0m`; // Yellow color
        break;
      case logLevels.Info:
      case logLevels.Notice:
        formattedMessage = `\x1b[36m${formattedMessage}\x1b[0m`; // Cyan color
        break;
      case logLevels.Debug:
        formattedMessage = `\x1b[35m${formattedMessage}\x1b[0m`; // Magenta color
        break;
      default:
        formattedMessage = `\x1b[37m${formattedMessage}\x1b[0m`; // White color
        break;
    }

    return formattedMessage;
  }
}
