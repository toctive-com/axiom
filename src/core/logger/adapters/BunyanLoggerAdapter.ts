import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Bunyan: A simple and extensible logging library with a focus on structured
 * JSON output. Website: https://github.com/trentm/node-bunyan
 */
export class BunyanLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default BunyanLoggerAdapter;
