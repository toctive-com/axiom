import Application from "@/bootstrap/Application";
import { resolve } from "node:path";

/**
 * Export all bootstrap files. This helps in maintenance mode and creating custom
 * applications in future.
 *
 */
export * from "./Application";
export * from "./Maintenance";

/**
 * The function creates and returns a new application instance with singletons for
 * main classes (HttpKernel and HttpRequest).
 *
 * @returns {Promise<Application>} an instance of the `Application` class with `
 * HttpKernel` and `HttpRequest` singletons registered.
 *
 */
export async function runApp(): Promise<Application> {
  // Get instance of Application
  const app = new Application({ basePath: resolve(__dirname, "../..") });

  // Load Service Providers which will load Routes, Middleware ... etc
  await app.registerServiceProviders();

  // Boot the application and return app instance
  return await app.boot();
}
