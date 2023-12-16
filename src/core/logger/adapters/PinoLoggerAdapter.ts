import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Pino: A fast and low-overhead logger with built-in JSON support and
 * structured logging capabilities. Website: https://getpino.io/
 */
export class PinoLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default PinoLoggerAdapter;
