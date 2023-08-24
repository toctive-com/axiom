import { ServiceProvider } from '../ServiceProvider';
import { Logger } from './Logger';
import { LoggerConfig } from './LoggerConfig';

/**
 * LogServiceProvider is a class that extends the ServiceProvider class to
 * register and provide the Logger instance within the application. It
 * initializes the Logger instance based on the provided configuration and sets
 * it as the application's logger.
 */
export class LogServiceProvider extends ServiceProvider {
  /**
   * Registers the Logger instance within the application container. The Logger
   * instance is created based on the configuration settings.
   */
  public async register(): Promise<void> {
    this.app.set('log', () => {
      // Retrieve the logger configuration from the application's configuration
      const config = this.app.config<LoggerConfig>('logger');

      // Create a new Logger instance with the provided configuration
      const logger = new Logger({ config });

      // Set the created logger instance as the application's logger
      this.app.logger = logger;

      // Return the logger instance
      return logger;
    });
  }

  /**
   * This method is used for additional bootstrapping or setup, if needed. It is
   * not implemented in this case, but it is available for overriding.
   */
  public async boot(): Promise<void> {
    // ...
  }
}
