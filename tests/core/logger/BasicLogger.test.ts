import { BasicLogger, LoggerArguments, logLevels } from '@/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('BasicLogger', () => {
  let logger: BasicLogger;
  const InfoLevel = 6;
  const WarningLevel = 4;

  beforeEach(() => {
    logger = new BasicLogger();
  });

  it('should log a message with the specified log level', async () => {
    // Mock the transport log method
    const mockTransport = {
      log: vi.fn().mockResolvedValue(undefined),
    };
    logger.transports = [mockTransport];

    // Log a message
    await logger.log(InfoLevel, 'Test message');

    // Expect the transport log method to have been called with the correct parameters
    expect(mockTransport.log).toHaveBeenCalledWith({
      message: 'Test message',
      rawMessage: 'Test message',
      messageId: expect.any(String),
      timestamp: expect.any(String),
      level: InfoLevel,
    });
  });

  it('should not log a message if the log level is higher than the configured log level', async () => {
    // Mock the transport log method
    const mockTransport = {
      log: vi.fn().mockResolvedValue(undefined),
    };
    logger.transports = [mockTransport];
    logger.config.logLevel = WarningLevel;

    // Log a message with a lower log level
    await logger.log(InfoLevel, 'Test message');

    // Expect the transport log method not to have been called
    expect(mockTransport.log).not.toHaveBeenCalled();
  });

  it('should format the log message using registered formatters', async () => {
    // Create a mock formatter
    const mockFormatter = {
      format: vi.fn((logDetails) => logDetails.message.toUpperCase()),
    };
    logger.formatters = [mockFormatter];

    // Mock the transport log method
    const mockTransport = {
      log: vi.fn().mockResolvedValue(undefined),
    };
    logger.transports = [mockTransport];

    // Log a message
    await logger.log(InfoLevel, 'Test message');

    // Expect the transport log method to have been called with the formatted message
    expect(mockTransport.log).toHaveBeenCalledWith({
      message: 'TEST MESSAGE',
      rawMessage: 'Test message',
      messageId: expect.any(String),
      timestamp: expect.any(String),
      level: InfoLevel,
    });

    // Expect the formatter to have been called with the correct parameters
    expect(mockFormatter.format).toHaveBeenCalledWith({
      message: 'Test message',
      rawMessage: 'Test message',
      messageId: expect.any(String),
      timestamp: expect.any(String),
      level: InfoLevel,
    });
  });

  it('emergency should log with the correct log level and message', async () => {
    const mockLog = vi.spyOn(logger, 'log'); // Spy on the log method to check if it's called

    const message = 'Emergency message';
    const data = { foo: 'bar' };
    const logMethods = [
      'emergency',
      'alert',
      'critical',
      'error',
      'warning',
      'notice',
      'info',
      'debug',
    ];

    let logLevel = logLevels.Emergency;
    for (const method of logMethods) {
      await logger[method](message, data);
      expect(mockLog).toHaveBeenCalledWith(logLevel, message, data);
      logLevel++;
    }
  });

  
  it('should set transports from LoggerArguments', () => {
    // Mock the transport log method
    const mockTransport = {
      log: vi.fn().mockResolvedValue(undefined),
    };
    const args: LoggerArguments = {
      transports: [mockTransport],
    };
    const loggerWithArgs = new BasicLogger(args);

    expect(loggerWithArgs.transports).toEqual(args.transports);
  });

  it('should set formatters from LoggerArguments', () => {
    const mockFormatter = { format: () => 'formatted' };
    const args: LoggerArguments = {
      formatters: [mockFormatter],
    };
    const loggerWithArgs = new BasicLogger(args);

    expect(loggerWithArgs.formatters).toEqual(args.formatters);
  });

  it('should set logLevel from LoggerArguments config', () => {
    const logLevel = logLevels.Info;
    const args: LoggerArguments = {
      config: {
        logLevel,
      },
    };
    const loggerWithArgs = new BasicLogger(args);

    expect(loggerWithArgs.config.logLevel).toBe(logLevel);
  });

  it('should set default logLevel if not provided in LoggerArguments config', () => {
    const defaultLogLevel = logLevels.Debug;
    const loggerWithoutArgs = new BasicLogger();

    expect(loggerWithoutArgs.config.logLevel).toBe(defaultLogLevel);
  });

  it('should handle error from transport', async () => {
    // Mock the transport log method
    const mockTransport = {
      log: () => Promise.reject(new Error('Test error')),
    };
    const args: LoggerArguments = {
      transports: [mockTransport],
    };
    const loggerWithArgs = new BasicLogger(args);

    // Make sure console.error is called with the expected error message
    const spyConsoleError = vi.spyOn(console, 'error');
    
    await loggerWithArgs.log(InfoLevel, 'Test message');

    expect(spyConsoleError).toHaveBeenCalledWith('An error occurred while calling transports:', expect.any(Error));
  });
});
