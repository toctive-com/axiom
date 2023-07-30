import { Application, Request, Response } from '@/core';
import { MaintenanceConfig } from '@/types';
import { exit } from 'node:process';
import { Url } from '..';

export class Maintenance {
  private config: MaintenanceConfig = {
    status: 503,
    template: '<h1>Website is under maintenance</h1>',
  };

  public isUnderMaintenance: boolean = false;

  constructor(app: Application) {
    this.isUnderMaintenance = app.config('app.maintenanceMode.enabled', false);
    if (this.isUnderMaintenance) {
      this.loadConfig(
        app.config<MaintenanceConfig>('app.maintenanceMode', undefined),
      );
    }
  }

  public loadConfig(config?: MaintenanceConfig) {
    // load maintenance mode configurations
    if (!config) {
      console.warn(
        `Failed to parse contents of ${config}. The application will use the default maintenance mode configurations`,
      );
      return this.config;
    }

    if (config) {
      return (this.config = config);
    }
  }

  public async handle({
    request,
    response,
  }: {
    request: Request;
    response: Response;
  }) {
    for (const path of this.config.except) {
      if (Url.trim(path) === Url.trim(request.url)) return;
    }

    this.handleRedirect(request, response);

    this.handleRetry(response);

    this.handleRefresh(response);

    response.writeHead(this.config.status);
    await response.send(this.config.template);

    // handle requests by respond with empty body and status code 503 (depending on maintenance mode config)
    console.log('(maintenance mode) exiting the app');
    exit();
  }

  protected handleRefresh(response: Response) {
    if (this.config.refresh) {
      response.appendHeader('Refresh', this.config.refresh.toString());
    }
  }

  protected handleRetry(response: Response) {
    // TODO Add option for `Retry-After: Date`
    if (this.config.retry) {
      response.appendHeader('Retry-After', this.config.retry.toString());
    }
  }

  protected handleRedirect(request: Request, response: Response) {
    // TODO add option to redirect some URLs to specific websites
    // For example:
    // redirect all traffic from '/dashboard/*' to 'admin.example.com'
    // and redirect all other traffic to 'example.com'

    if (this.config.redirect && request.url !== this.config.redirect) {
      response.appendHeader('Location', this.config.redirect);
      response.writeHead(302);
      response.send();

      exit();
    }
  }
}
export default Maintenance;
