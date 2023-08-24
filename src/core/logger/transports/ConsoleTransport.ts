import { LogDetails } from '../LogDetails';
import { LogTransport } from './LogTransport';

/**
 * ConsoleTransport is a class that implements the LogTransport interface and
 * provides a simple way to log messages to the console.
 * It logs the formatted log message to the console using the `console.log`
 * method.
 */
export class ConsoleTransport implements LogTransport {
  /**
   * Asynchronously logs the provided log message to the console.
   * @param logDetails An object containing log-related details like the
   * formatted log message.
   */
  async log({ message }: LogDetails): Promise<void> {
    console.log(message);
  }
}
