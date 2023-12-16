import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Loglevel: A lightweight logging library that uses the console's logging
 * methods but allows for customizable log levels. Website:
 * https://github.com/pimterry/loglevel
 */
export class LogLevelLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default LogLevelLoggerAdapter;
