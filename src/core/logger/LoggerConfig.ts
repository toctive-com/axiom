import { LogLevel } from './LogLevel';

/**
 * LoggerConfig is an interface that specifies various configuration options for
 * a logger instance.
 */
export interface LoggerConfig {
  /**
   * An optional log level that determines the minimum severity level of
   * messages to be logged.
   */
  logLevel?: LogLevel;

  /**
   * An optional context object that provides additional contextual information
   * to be included with log messages.
   */
  context?: Record<string, any>;

  /**
   * A flag indicating whether to enable performance metrics tracking for log
   * operations.
   */
  enablePerformanceMetrics?: boolean;

  /**
   * A flag indicating whether to silence all log output. When set to true, log
   * messages will not be displayed.
   */
  silent?: boolean;
}
