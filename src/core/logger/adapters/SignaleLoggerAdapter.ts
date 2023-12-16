import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Signale: A customizable and hackable logging library that adds colors,
 * symbols, and styles to console output. Website:
 * https://github.com/klaussinani/signale
 */
export class SignaleLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default SignaleLoggerAdapter;
