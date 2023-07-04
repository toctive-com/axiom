import config from "@/config";
import { RouteServiceProvider } from "@/providers/RouteServiceProvider";
import { Application as App, ServiceProvider } from "@toctive/makex";

export class Application extends App {
  /**
   * all providers that will be registered and booted when the application boots
   *
   * @var ServiceProvider[]
   *
   */
  providers: ServiceProvider[] = [new RouteServiceProvider(this)];

  /**
   * Register project configuration.
   *
   * @returns {Object} { }
   *
   */
  protected loadConfig(): Object {
    return config;
  }
}

export default Application;
