import { LogDetails } from '@/core';
import { ConsoleTransport } from '@/core/logger/transports';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConsoleTransport', () => {
  let consoleTransport: ConsoleTransport;

  beforeEach(() => {
    consoleTransport = new ConsoleTransport();
  });

  it('should log formatted message to the console', async () => {
    const originalConsoleLog = console.log;
    console.log = vi.fn();
    const mockMessage = 'Mock log message';
    const mockLogDetails: LogDetails = {
      message: mockMessage,
      level: 0,
      messageId: '',
      rawMessage: '',
      timestamp: ''
    };
    
    // Mock console.log to capture the logged message
    const spyConsoleLog = vi.spyOn(console, 'log');
    
    await consoleTransport.log(mockLogDetails);
    
    expect(spyConsoleLog).toHaveBeenCalledWith(mockMessage);
    console.log = originalConsoleLog;
  });
});
