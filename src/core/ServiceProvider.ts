import Application from '@/core/Application';

/**
 * The `ServiceProvider` class is an abstract base class for creating service providers
 * in the Axiom framework. Service providers allow you to register and bootstrap
 * application services.
 *
 * @abstract
 * @class ServiceProvider
 */
export abstract class ServiceProvider {
  /**
   * The application instance that the service provider is associated with.
   *
   * @var Application
   */
  protected app: Application;

  /**
   * Creates a new instance of the service provider.
   *
   * @constructor
   * @param app - The application instance to associate with the service provider.
   */
  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Register any application services provided by the service provider.
   *
   * @abstract
   * @returns {Promise<void>} - A Promise that resolves when the registration is complete.
   */
  public async register(): Promise<void> {}

  /**
   * Bootstrap any application services provided by the service provider.
   * This method is called after all service providers have been registered.
   *
   * @abstract
   * @returns {Promise<void>} - A Promise that resolves when the bootstrapping is complete.
   */
  public async boot(): Promise<void> {}
}

export default ServiceProvider;
