import { BasicLogger } from '../BasicLogger';
import { LoggerArguments } from '../LoggerArguments';

/**
 * LoggerAdapter is a class that extends the functionality of the BasicLogger
 * class to provide a more specialized logger instance.
 * It can be used to create logger instances with custom configurations.
 */
export class LoggerAdapter extends BasicLogger {
  /**
   * Creates a new LoggerAdapter instance with optional configuration arguments.
   *
   * @param args An optional LoggerArguments object containing configuration
   * settings for the logger.
   */
  constructor(args?: LoggerArguments) {
    super(args);
  }
}

export default LoggerAdapter;
