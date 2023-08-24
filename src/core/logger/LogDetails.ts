import { LogLevel } from './LogLevel';

/**
 * LogDetails is an interface that defines the structure of a log entry,
 * capturing various details about the logged message.
 */
export interface LogDetails {
  /**
   * Represents the severity level of the logged message.
   */
  level: LogLevel;

  /**
   * A unique identifier associated with the log message.
   */
  messageId: string;

  /**
   * The actual content of the log message.
   */
  message: string;

  /**
   * The unmodified original log message before any processing or formatting.
   */
  rawMessage: string;

  /**
   * A timestamp indicating when the log entry was created.
   */
  timestamp: string;
}
