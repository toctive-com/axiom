import Application from '@/Foundation/Application';

type callback = (app: Application) => unknown;

export abstract class ServiceProvider {
  /**
   * The application instance.
   *
   * @var Application
   */
  protected app: Application;

  /**
   * All of the registered booting callbacks.
   *
   * @var array
   */
  protected bootingCallbacks: callback[] = [];

  /**
   * All of the registered booted callbacks.
   *
   * @var array
   */
  protected bootedCallbacks: callback[] = [];

  /**
   * Create a new service provider instance.
   *
   * @param Application app
   *
   * @return void
   *
   */
  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Register any application services.
   *
   * @return void
   *
   */
  public async register() {
    // ...
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   *
   */
  public async boot() {
    // ...
  }

  /**
   * Register a booting callback to be run before the "boot" method is called.
   *
   * @param callback callback
   *
   * @return void
   *
   */
  public runBeforeBooting(callback: callback) {
    this.bootingCallbacks.push(callback);
  }

  /**
   * Register a booted callback to be run after the "boot" method is called.
   *
   * @param callback callback
   *
   * @return void
   *
   */
  public runAfterBooted(callback: callback) {
    this.bootedCallbacks.push(callback);
  }

  /**
   * Call the registered booting callbacks.
   *
   * @return void
   *
   */
  public callBootingCallbacks() {
    for (const fn of this.bootingCallbacks) fn(this.app);
  }

  /**
   * Call the registered booted callbacks.
   *
   * @return void
   *
   */
  public callBootedCallbacks() {
    for (const fn of this.bootedCallbacks) fn(this.app);
  }
}
