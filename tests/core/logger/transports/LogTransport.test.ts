import { LogDetails, LogTransport } from '@/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock LogTransport for testing
class MockLogTransport extends LogTransport {}

describe('LogTransport', () => {
  let logTransport: LogTransport;

  beforeEach(() => {
    logTransport = new MockLogTransport();
  });

  it('should log message to the console by default', async () => {
    const spyMockLog = vi.spyOn(logTransport, 'log');
    const originalConsoleLog = console.log = vi.fn((...args: unknown[])=>{});
    const spyConsoleLog = vi.spyOn(console, 'log');
    const logDetails: LogDetails = {
      level: 6,
      messageId: 'abc123',
      message: 'Test message',
      rawMessage: 'Test message',
      timestamp: '2023-08-24T12:00:00Z',
    };

    await logTransport.log(logDetails);

    expect(spyMockLog).toHaveBeenCalledWith(logDetails);
    expect(spyConsoleLog).toHaveBeenCalledWith(logDetails.message);
    console.log = originalConsoleLog;
  });
});
