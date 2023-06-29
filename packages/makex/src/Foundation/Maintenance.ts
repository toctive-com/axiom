import { HttpRequest, HttpResponse, MaintenanceConfig } from "@toctive/makex";
import { existsSync, readFileSync } from "node:fs";
import { exit } from "node:process";

export class Maintenance {
  private config: MaintenanceConfig = {
    status: 503,
    template: "<h1>Website is under maintenance</h1>",
  };

  public isUnderMaintenance: boolean = false;

  constructor(maintenanceConfigFile: string) {
    if (existsSync(maintenanceConfigFile)) {
      this.isUnderMaintenance = true;
      this.loadConfig(maintenanceConfigFile);
      return;
    }
  }

  public loadConfig(config?: string | MaintenanceConfig) {
    // load maintenance mode configurations
    if (typeof config === "string") {
      try {
        return (this.config = JSON.parse(
          readFileSync(config, { encoding: "utf-8" })
        ));
      } catch (error) {
        console.warn(
          `Failed to parse contents of ${config}. The application will use the default maintenance mode configurations`
        );
        return this.config;
      }
    }

    if (config) {
      return (this.config = config);
    }
  }

  public async handle({
    request,
    response,
  }: {
    request: HttpRequest;
    response: HttpResponse;
  }) {
    for (const path of this.config.except) {
      // FIXME trim '/' from path
      // `/api/test/` => `api/test`
      // const except = path !== "/" ? path : path;
      if (path == request.url) return;
    }

    this.handleRedirect(request, response);

    this.handleRetry(response);

    this.handleRefresh(response);

    response.writeHead(this.config.status);
    await response.send(this.config.template);

    // handle requests by respond with empty body and status code 503 (depending on maintenance mode config)
    console.log("(maintenance mode) exiting the app");
    exit();
  }

  protected handleRefresh(response: HttpResponse) {
    if (this.config.refresh) {
      response.appendHeader("Refresh", this.config.refresh.toString());
    }
  }

  protected handleRetry(response: HttpResponse) {
    // TODO Add option for `Retry-After: Date`
    if (this.config.retry) {
      response.appendHeader("Retry-After", this.config.retry.toString());
    }
  }

  protected handleRedirect(request: HttpRequest, response: HttpResponse) {
    // TODO add option to redirect some URLs to specific websites
    // For example:
    // redirect all traffic from '/dashboard/*' to 'admin.example.com'
    // and redirect all other traffic to 'example.com'

    if (this.config.redirect && request.url !== this.config.redirect) {
      response.appendHeader("Location", this.config.redirect);
      response.writeHead(302);
      response.send();

      exit();
    }
  }
}
export default Maintenance;
