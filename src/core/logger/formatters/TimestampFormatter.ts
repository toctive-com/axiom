import { LogDetails } from '../LogDetails';
import { LogFormatter } from './LogFormatter';

/**
 * TimestampFormatter is a class that implements the LogFormatter interface to
 * provide log messages with timestamps. It adds a timestamp to the log message,
 * enhancing the log entry with the time of creation.
 */
export class TimestampFormatter implements LogFormatter {
  /**
   * Generates a formatted log message with a timestamp.
   * @param logDetails An object containing log-related details like level,
   * messageId, message, and timestamp.
   * @returns The formatted log message with a timestamp.
   */
  format({ message, timestamp }: LogDetails): string {
    // Combine the provided timestamp with the message
    return `${timestamp} - ${message}`;
  }
}
