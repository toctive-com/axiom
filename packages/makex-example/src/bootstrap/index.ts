import Application from "@/bootstrap/Application";
import Maintenance from "@/bootstrap/Maintenance";
import config from "@/config";
import { HttpKernel } from "@toctive/makex";
import { join, resolve } from "node:path";

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
  const app = Application.getInstance({
    basePath: resolve(__dirname, "../"),
    config,
  });

  // Register Kernels in Service Container
  app.singleton(Maintenance, null, join(__dirname, "../down.json"));
  app.singleton(HttpKernel, null, {
    server: app.createServer(),
    port: app.config("server.port", 8000),
  });

  // Load Service Providers which will load Routes, Middleware ... etc
  await app.registerServiceProviders()

  // Boot the application and return app instance
  return await app.boot();
}
