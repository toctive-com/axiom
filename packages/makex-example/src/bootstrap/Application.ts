import Maintenance from "@/bootstrap/Maintenance";
import config from "@/config";
import { AppServiceProvider } from "@/providers/AppServiceProvider";
import { RouteServiceProvider } from "@/providers/RouteServiceProvider";
import {
  Application as App,
  HttpKernel,
  ServiceProvider,
} from "@toctive/makex";

export class Application extends App {
  /**
   * all providers that will be registered and booted when the application boots
   *
   * @var ServiceProvider[]
   *
   */
  providers: ServiceProvider[] = [
    new AppServiceProvider(this),
    new RouteServiceProvider(this),
  ];

  /**
   * Register project configuration.
   *
   * @returns {Object} { }
   *
   */
  protected loadConfig(): Object {
    return config;
  }

  /**
   * Registers the kernels that will be used to boot the application as
   * singletons in the service container.
   *
   * @returns {void}
   *
   */
  protected registerSingletons(): void {
    this.set('Maintenance', () => new Maintenance(this));
    this.set('HttpKernel', () => new HttpKernel(this));
  }
}

export default Application;
