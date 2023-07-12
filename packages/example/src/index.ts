import { runApp } from '@/bootstrap';
import { HttpKernel, clustering } from 'axiom';

/**
 * Run The Application
 * --------------------------------------------------------------------------
 * Once we have the application, we can handle the incoming request using
 * the application's HTTP kernel. Then, we will send the response back
 * to this client's browser, allowing them to enjoy our application.
 *
 */
async function main() {
  // Load all developer files (e.g. routes, middleware, class ...)
  const app = await runApp();

  // Load framework kernel which includes HTTP server and will handle requests
  const kernel = app.make<HttpKernel>('HttpKernel');

  // Wait for incoming request and return it with empty response object
  const { request, response } = await kernel.captureRequest();

  // Handle the request using the response object
  const result = await kernel.handle(request, response);

  // Send response to client
  await result.send();

  // Close the server and terminate all incoming requests
  await kernel.terminate(request, response);
}

/**
 * Run The Server In Clusters
 * --------------------------------------------------------------------------
 * Create multiple processes to handle incoming requests. This is useful for testing
 * and debugging. The main process will be opened for every unless killed manually.
 *
 */
clustering(main);
