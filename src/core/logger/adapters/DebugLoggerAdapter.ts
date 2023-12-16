import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';

/**
 * Debug: A small and simple debugging utility that can be toggled on and off
 * based on environment variables. Website: https://github.com/visionmedia/debug
 */
export class DebugLoggerAdapter extends LoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // TODO - Create new logger instance.
  }
}

export default DebugLoggerAdapter;
