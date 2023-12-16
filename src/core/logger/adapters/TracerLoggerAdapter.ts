import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * tracer: A lightweight logging library with built-in support for colored
 * console output and log levels. Website: https://github.com/baryon/tracer
 */
export class TracerLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default TracerLoggerAdapter;
