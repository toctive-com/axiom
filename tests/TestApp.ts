import { Application} from '../src';
import { ConsoleKernel, HttpKernel } from '../src/core/kernel';


class App extends Application {
  /**
   * Registers the kernels that will be used to boot the application as
   * singletons in the service container.
   *
   * @returns {void}
   *
   */
  protected registerSingletons(): void {
    this.set('HttpKernel', () => new HttpKernel(this));
    this.set('ConsoleKernel', () => new ConsoleKernel(this));
  }
}

/**
 * Runs an application, captures a request using the HttpKernel, and returns the
 * application.
 *
 * @returns Returning the app object after running the HTTP Kernel.
 *
 */
export async function TestApp() {
  // Get instance of Application
  const app = new App();

  // Boot the application and return app instance
  await app.boot();

  return app;
}

export default TestApp;
