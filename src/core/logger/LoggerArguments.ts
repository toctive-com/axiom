import { LoggerConfig } from './LoggerConfig';
import { LoggerAdapter } from './adapters';
import { LogFormatter } from './formatters/LogFormatter';
import { LogTransport } from './transports/LogTransport';

/**
 * LoggerArguments is an interface that defines the configuration options for
 * setting up a logger instance.
 */
export interface LoggerArguments {
  /**
   * An optional configuration object that customizes various aspects of the
   * logger behavior.
   */
  config?: Partial<LoggerConfig>;

  /**
   * An array of external LoggerAdapter instances that can be used alongside the
   * main logger.
   */
  externalLoggers?: LoggerAdapter[];

  /**
   * An array of LogTransport instances responsible for sending log messages to
   * different destinations.
   */
  transports?: LogTransport[];

  /**
   * An array of LogFormatter instances used to format log messages before they
   * are transported.
   */
  formatters?: LogFormatter[];
}
