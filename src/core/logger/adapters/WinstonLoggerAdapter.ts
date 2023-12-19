import moment from 'moment';
import { join } from 'node:path';
import winston from 'winston';
import { LogLevel, logLevels } from '../LogLevel';
import { LoggerArguments } from '../LoggerArguments';
import { LoggerAdapter } from './LoggerAdapter';
import { ConvertLowercase } from '@/types';

export type WinstonLogLevels = Pick<
  ConvertLowercase<typeof logLevels>,
  'debug' | 'info' | 'warn' | 'error'
>;

/**
 * WinstonLoggerAdapter is a class that extends the functionality of the
 * LoggerAdapter class to provide integration with the Winston logging library.
 *
 * Winston: A versatile logging library with various transports and customizable
 * logging levels. Website: https://github.com/winstonjs/winston
 */
export class WinstonLoggerAdapter extends LoggerAdapter {
  protected _logger: winston.Logger;
  public get logger(): winston.Logger {
    return this._logger;
  }

  /**
   * Creates an instance of WinstonLoggerAdapter with optional configuration
   * arguments.
   * Initializes the Winston logger with specified log formatting, transports,
   * and log level.
   * @param args An optional LoggerArguments object containing configuration
   * settings for the logger.
   */
  constructor(args?: LoggerArguments) {
    super(args);

    this._logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(process.cwd(), 'logs'),
          filename: 'logs.log',
          format: winston.format.combine(
            winston.format.uncolorize(),
            winston.format.json(),
          ),
          maxsize: 10 * 1024 * 1024, // 10 MB
          rotationFormat: () => '-' + moment().format('YYYY-MM-DD'),
        }),
      ],
      silent: args?.config?.silent,
      level: this.getWinstonLevel(args?.config?.logLevel),
    });
  }

  /**
   * Maps the LogLevel enum values to corresponding Winston log level strings.
   * @param level The LogLevel value.
   * @returns The corresponding Winston log level string.
   */
  protected getWinstonLevel(level: LogLevel): keyof WinstonLogLevels {
    switch (level) {
      case logLevels.Debug:
        return 'debug';
      case logLevels.Info:
      case logLevels.Notice:
        return 'info';
      case logLevels.Warning:
      case logLevels.Alert:
        return 'warn';
      case logLevels.Error:
      case logLevels.Critical:
      case logLevels.Emergency:
        return 'error';
      default:
        return 'info';
    }
  }

  /**
   * Logs a message with the specified log level using the configured Winston
   * logger.
   * @param level The log level of the message.
   * @param message The main content of the log message.
   * @param data Additional data to be included in the log message.
   */
  async log(level: LogLevel, message: string, data?: any): Promise<void> {
    if (!this.shouldLog(level)) return;
    this.logger.log(this.getWinstonLevel(level), message, data);
  }
}

export default WinstonLoggerAdapter;
