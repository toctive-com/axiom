# `Axiom`

Axiom is a backend framework built using TypeScript and implement Express.js functionality from scratch

## Usage

Here is a full example to how to use Axiom in scalable project

```ts
import { Application, HttpKernel } from '@toctive/axiom';

export async function runApp(): Promise<Application> {
  // Get instance of Application
  const application = new Application({});

  // Load Service Providers which will load Routes, Middleware ... etc
  await application.registerServiceProviders();

  // Boot the application and return app instance
  return await application.boot();
}

// Load all developer files (e.g. routes, middleware, class ...)
const app = await runApp();

// Load framework kernel which includes HTTP server and will handle requests
const kernel = app.make<HttpKernel>('HttpKernel');

// Handle the request using the response object and send response to client
await kernel.captureRequest();
```
