import { LogDetails } from '../LogDetails';

/**
 * LogTransport is an abstract class that defines the base structure for log
 * message transport mechanisms.
 * Subclasses of this class can implement specific ways of delivering log
 * messages to various destinations.
 */
export abstract class LogTransport {
  /**
   * log is an asynchronous method that handles the transportation of log
   * messages to a destination.
   *
   * @param logDetails An object containing log-related details like level,
   * messageId, message, rawMessage, and timestamp.
   */
  async log(logDetails: LogDetails): Promise<void> {
    // This method can be overridden by subclasses to implement specific log
    // transportation logic. By default, the method print the message to the
    // console.
    console.log(logDetails.message);
  }
}
