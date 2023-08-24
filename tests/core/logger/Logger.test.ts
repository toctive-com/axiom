import {
  LogDetails,
  LogLevel,
  LogTransport,
  Logger,
  LoggerAdapter,
  LoggerArguments,
  WinstonLoggerAdapter,
} from '@/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock LoggerAdapter for testing
class MockLoggerAdapter extends LoggerAdapter {
  async log(level: LogLevel, message: string, data?: Object): Promise<void> {
    // Implement mock log
  }
}

describe('Logger', () => {
  let logger: Logger;
  const DebugLevel = 7;
  const InfoLevel = 6;
  const WarningLevel = 4;

  beforeEach(() => {
    logger = new Logger();
  });

  it('should initialize with a default external logger if not provided in arguments', () => {
    expect(logger.externalLoggers).toBeDefined();
    expect(logger.externalLoggers.length).toBe(1);
    expect(logger.externalLoggers[0]).toBeInstanceOf(WinstonLoggerAdapter);
  });

  it('should use the internal logger when no external loggers are provided', async () => {
    const logger = new Logger({ transports: [] });
    logger.log = vi.fn();
    const spy = vi.spyOn(logger, 'log');
    await logger.log(InfoLevel, 'Test message');
    expect(spy).toHaveBeenCalledWith(InfoLevel, 'Test message');
  });

  it('should log using only internal logger', async () => {
    logger.log = vi.fn();
    const spyLog = vi.spyOn(logger, 'log');
    const level = InfoLevel;
    const message = 'Internal logger message';
    const data = { key: 'value' };

    await logger.log(level, message, data);

    expect(spyLog).toHaveBeenCalledWith(level, message, data);
    // Make sure externalLoggers property is undefined or empty
    expect(logger.externalLoggers).toHaveLength(1);
    expect(logger.externalLoggers[0]).toBeInstanceOf(WinstonLoggerAdapter);
  });

  it('should log messages using external loggers when provided', async () => {
    class ExternalLogger extends LoggerAdapter {
      async log(level: number, message: string, data?: any) {}
    }

    // Spy on the log method to check if it's called
    const externalLogger = new ExternalLogger();
    const mockLog = vi.spyOn(externalLogger, 'log');

    let logger = new Logger({ externalLoggers: [externalLogger] });
    await logger.log(InfoLevel, 'Test message', { foo: 'bar' });

    expect(mockLog).toHaveBeenCalledWith(InfoLevel, 'Test message', {
      foo: 'bar',
    });
  });

  it('should set external loggers from LoggerArguments', () => {
    const mockAdapter = new MockLoggerAdapter();
    const args: LoggerArguments = {
      externalLoggers: [mockAdapter],
    };
    const loggerWithArgs = new Logger(args);

    expect(loggerWithArgs.externalLoggers).toEqual(args.externalLoggers);
  });

  it('should use external loggers for log transportation', async () => {
    const mockAdapter = new MockLoggerAdapter();
    const spyExternalLog = vi.spyOn(mockAdapter, 'log');
    const args: LoggerArguments = {
      externalLoggers: [mockAdapter],
    };
    const loggerWithArgs = new Logger(args);

    await loggerWithArgs.log(InfoLevel, 'Test message');

    expect(spyExternalLog).toHaveBeenCalledWith(
      InfoLevel,
      'Test message',
      undefined,
    );
  });

  it('should use super.log if no external loggers are provided', async () => {
    logger.log = vi.fn();
    const spySuperLog = vi.spyOn(logger, 'log');
    await logger.log(InfoLevel, 'Test message');

    expect(spySuperLog).toHaveBeenCalledWith(InfoLevel, 'Test message');
  });
});
