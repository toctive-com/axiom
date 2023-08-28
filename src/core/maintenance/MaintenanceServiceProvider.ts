import { ServiceProvider } from '../ServiceProvider';
import { Request, Response } from '../http';
import { Maintenance } from './Maintenance';

/**
 * The `MaintenanceServiceProvider` class registers and handles maintenance mode.
 *
 * @class MaintenanceServiceProvider
 */
export class MaintenanceServiceProvider extends ServiceProvider {
  /**
   * Register any application services.
   */
  public async register() {
    this.app.set('Maintenance', () => new Maintenance(this.app));
  }
  /**
   * Middleware to handle maintenance mode.
   *
   * This method registers a middleware function in the application that checks
   * if the application is currently in maintenance mode. If maintenance mode is
   * enabled, the middleware will use the Maintenance class to handle the
   * maintenance response. If maintenance mode is not enabled, the middleware
   * will call the `next()` function to proceed with the next middleware or
   * route handler.
   *
   * @throws {Error} If an error occurs while handling maintenance mode.
   *
   * @returns {Promise<void>}
   *
   */
  public async boot(): Promise<void> {
    this.app.add((request: Request, response: Response, next: Function) => {
      // Retrieve the instance of the Maintenance class from the application
      const maintenance = this.app.make<Maintenance>('Maintenance');

      if (maintenance.isUnderMaintenance) {
        // If maintenance mode is enabled, handle the maintenance response
        maintenance.handle({ request, response }).catch((err) => {
          // Handle errors that occur while handling maintenance mode
          this.app.logger.error('Error handling maintenance mode:', err);
          response.setStatus('INTERNAL_SERVER_ERROR').send();
        });
      } else {
        // If maintenance mode is not enabled, proceed to the next middleware
        next();
      }
    });
  }
}
