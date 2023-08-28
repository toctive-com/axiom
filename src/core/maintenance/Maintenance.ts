import { Application, Request, Response } from '@/core';
import { MaintenanceConfig } from '@/types';
import { exit } from 'node:process';
import { Url } from '../..';

/**
 * The `Maintenance` class is responsible for handling maintenance mode requests
 * and responding with appropriate status codes and content.
 *
 * @class Maintenance
 */
export class Maintenance {
  /**
   * Default maintenance configuration.
   *
   * @var MaintenanceConfig
   */
  private config: MaintenanceConfig = {
    status: 503,
    template: '<h1>Website is under maintenance</h1>',
    except: [],
  };

  /**
   * Flag indicating whether the application is under maintenance.
   *
   * @var boolean
   */
  public isUnderMaintenance: boolean = false;

  /**
   * Creates an instance of the `Maintenance` class.
   *
   * @constructor
   * @param app - The application instance.
   */
  constructor(protected app: Application) {
    this.isUnderMaintenance = app.getConfig(
      'app.maintenanceMode.enabled',
      false,
    );
    if (this.isUnderMaintenance) {
      this.loadConfig(
        app.getConfig<MaintenanceConfig>('app.maintenanceMode', undefined),
      );
    }
  }

  /**
   * Load maintenance mode configuration.
   *
   * @param config - Maintenance configuration.
   * @returns Maintenance configuration.
   */
  public loadConfig(config?: MaintenanceConfig): MaintenanceConfig {
    if (!config) {
      this.app.logger.warning(
        `Failed to parse maintenance mode configuration. Using default configurations.`,
      );
      return this.config;
    }

    return (this.config = config);
  }

  /**
   * Handle maintenance mode request.
   *
   * @param request - The incoming request object.
   * @param response - The response object.
   */
  public async handle({
    request,
    response,
  }: {
    request: Request;
    response: Response;
  }) {
    // Check exceptions
    for (const path of this.config.except) {
      if (Url.trim(path) === Url.trim(request.url)) return;
    }

    // Redirect handling
    this.handleRedirect(request, response);

    // Retry handling
    this.handleRetry(response);

    // Refresh handling
    this.handleRefresh(response);

    // Respond with maintenance content and status code
    response.writeHead(this.config.status);
    await response.send(this.config.template);

    // Exit the application
    this.app.logger.error('(maintenance mode) Exiting the app');
    exit();
  }

  /**
   * Handle Refresh header if configured.
   *
   * @param response - The response object.
   */
  protected handleRefresh(response: Response) {
    if (this.config.refresh) {
      response.appendHeader('Refresh', this.config.refresh.toString());
    }
  }

  /**
   * Handle Retry-After header if configured.
   *
   * @param response - The response object.
   */
  protected handleRetry(response: Response) {
    if (this.config.retry) {
      response.appendHeader('Retry-After', this.config.retry.toString());
    }
  }

  /**
   * Handle redirection if configured.
   *
   * @param request - The incoming request object.
   * @param response - The response object.
   */
  protected handleRedirect(request: Request, response: Response) {
    if (this.config.redirect && request.url !== this.config.redirect) {
      response.appendHeader('Location', this.config.redirect);
      response.writeHead(302);
      response.send();

      exit();
    }
  }
}

export default Maintenance;
