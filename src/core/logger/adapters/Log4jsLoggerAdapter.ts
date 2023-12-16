import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Log4js: A flexible logging library that supports multiple appenders and
 * customizable log levels. Website: https://log4js-node.github.io/log4js-node/
 */
export class Log4jsLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default Log4jsLoggerAdapter;
