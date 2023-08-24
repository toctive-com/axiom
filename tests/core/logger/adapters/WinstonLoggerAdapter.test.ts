import {
  LogLevel,
  LoggerArguments,
  WinstonLoggerAdapter,
  logLevels,
} from '@/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import winston from 'winston';

let getWinstonLevel: (level: number) => string;
let logger: winston.Logger;

// Mock WinstonLoggerAdapter for testing
class MockWinstonLoggerAdapter extends WinstonLoggerAdapter {
  constructor(args?: LoggerArguments) {
    super(args);
    // Override constructor to avoid initializing the actual Winston logger
    getWinstonLevel = this.getWinstonLevel;
    logger = this._logger;
  }
}

describe('WinstonLoggerAdapter', () => {
  let loggerAdapter: WinstonLoggerAdapter;
  const DebugLevel = 7;
  const InfoLevel = 6;
  const WarningLevel = 4;

  beforeEach(() => {
    loggerAdapter = new MockWinstonLoggerAdapter();
  });

  it('should map log levels to Winston levels', () => {
    const debugWinstonLevel = getWinstonLevel(logLevels.Debug);
    const infoWinstonLevel = getWinstonLevel(logLevels.Info);
    const warningWinstonLevel = getWinstonLevel(logLevels.Warning);
    const errorWinstonLevel = getWinstonLevel(logLevels.Error);

    expect(debugWinstonLevel).toBe('debug');
    expect(infoWinstonLevel).toBe('info');
    expect(warningWinstonLevel).toBe('warn');
    expect(errorWinstonLevel).toBe('error');
  });

  it('should log message using configured Winston logger', async () => {
    const spyWinstonLog = vi.spyOn(logger, 'log');
    const level = InfoLevel;
    const message = 'Test message';
    const data = { key: 'value' };

    await loggerAdapter.log(level, message, data);

    expect(spyWinstonLog).toHaveBeenCalledWith('info', message, data);
  });

  it('should not log if shouldLog returns false', async () => {
    let shouldLogMocked: (level: number) => boolean;
    class MockWinstonLoggerAdapter extends WinstonLoggerAdapter {
      constructor(args?: LoggerArguments) {
        super(args);
        // Override constructor to avoid initializing the actual Winston logger
        this._logger = winston.createLogger();
        getWinstonLevel = this.getWinstonLevel;
        logger = this.logger;
        shouldLogMocked = this.shouldLog = vi.fn().mockReturnValue(false);
      }
    }

    let loggerAdapter = new MockWinstonLoggerAdapter();

    const spyWinstonLog = vi.spyOn(logger, 'log');
    const level = InfoLevel;
    const message = 'Test message';

    await loggerAdapter.log(level, message);

    expect(spyWinstonLog).not.toHaveBeenCalled();
  });

  it('should use default log level "info" if mapping is missing', () => {
    const missingMappingLevel = 99;
    const winstonLevel = getWinstonLevel(missingMappingLevel as LogLevel);

    expect(winstonLevel).toBe('info');
  });

  
  it('should set silent mode based on LoggerArguments', () => {
    const silentArgs: LoggerArguments = {
      config: {
        silent: true,
      },
    };
    const nonSilentArgs: LoggerArguments = {
      config: {
        silent: false,
      },
    };
    const silentLogger = new MockWinstonLoggerAdapter(silentArgs);
    const nonSilentLogger = new MockWinstonLoggerAdapter(nonSilentArgs);
    
    expect(nonSilentLogger.logger.silent).toBe(false);
    expect(silentLogger.logger.silent).toBe(true);
  });
});
