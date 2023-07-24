import { Application, HttpKernel } from '@/Core';

/**
 * Runs an application, captures a request using the HttpKernel, and returns the
 * application.
 *
 * @returns Returning the app object after running the HTTP Kernel.
 *
 */
export async function TestApp() {
  // Get instance of Application
  const app = new Application({});

  // Boot the application and return app instance
  await app.boot();

  app.make<HttpKernel>('HttpKernel').captureRequest();

  return app;
}

export default TestApp;
