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
}

export default Application;
