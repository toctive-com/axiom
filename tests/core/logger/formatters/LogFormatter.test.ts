import { LogFormatter, LogDetails } from '@/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock LogFormatter for testing
class MockLogFormatter extends LogFormatter {}

describe('LogFormatter', () => {
  let logFormatter: LogFormatter;
  const DebugLevel = 7;
  const InfoLevel = 6;
  const WarningLevel = 4;

  beforeEach(() => {
    logFormatter = new MockLogFormatter();
  });

  it('should return the unmodified message by default', () => {
    const logDetails: LogDetails = {
      level: InfoLevel,
      messageId: 'abc123',
      message: 'Test message',
      rawMessage: 'Test message',
      timestamp: '2023-08-24T12:00:00Z',
    };

    const formattedMessage = logFormatter.format(logDetails);

    expect(formattedMessage).toBe(logDetails.message);
  });

  it('should format the message using custom formatter', () => {
    const spyLogFormatterFormat = vi.spyOn(logFormatter, 'format');
    const logDetails: LogDetails = {
      level: InfoLevel,
      messageId: 'def456',
      rawMessage: 'Original message',
      message: 'Original message',
      timestamp: '2023-08-24T12:30:00Z',
    };

    const formattedMessage = logFormatter.format(logDetails);

    expect(spyLogFormatterFormat).toHaveBeenCalledWith(logDetails);
    expect(formattedMessage).toBe(logDetails.message);
  });
});
