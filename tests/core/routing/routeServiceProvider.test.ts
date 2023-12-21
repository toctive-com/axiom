import { Application, HttpKernel, Request, Response, Router } from '@/core';
import { RouteServiceProvider } from '@/core/routing/RouteServiceProvider';
import { Socket } from 'node:net';
import TestApp from 'tests/TestApp';
import { beforeEach, describe, expect, it, vi } from 'vitest';

class TestableRouteServiceProvider extends RouteServiceProvider {
  // Expose the app property for testing
  public getTestableApp() {
    return this.app;
  }
}

describe('RouteServiceProvider', () => {
  let serviceProvider: TestableRouteServiceProvider;
  let router: Router;
  let app: Application;
  let request: Request;
  let response: Response;

  beforeEach(async () => {
    router = new Router(); // Create a new Router instance before each test
    app = await TestApp();
    serviceProvider = new TestableRouteServiceProvider(app);

    request = new Request(new Socket());
    request.app = app;
    response = new Response(request);
    response.app = app;
  });

  it('should register routes and execute matched route', async () => {
    const request = new Request(new Socket());
    request.app = app;
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);
    response.app = app;

    let routeExecuted = false;

    router.get('/test', () => {
      routeExecuted = true;
      return 'Route executed';
    });

    serviceProvider.registerRoutes(router);

    const middleware = app.middleware[0];

    const nextFunction = vi.fn();

    await middleware(request, response, nextFunction);

    expect(routeExecuted).toBe(true);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle null or undefined route action result', async () => {
    const request = new Request(new Socket());
    request.app = app;
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);
    response.app = app;

    let routeExecuted = false;

    router.get('/test', () => {
      routeExecuted = true;
      return 'Route executed';
    });

    serviceProvider.registerRoutes(router);

    const middleware = app.middleware[0];

    const nextFunction = vi.fn();

    await middleware(request, response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle object route action result', async () => {
    const request = new Request(new Socket());
    request.app = app;
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);
    response.app = app;

    const data = { message: 'Hello, world!' };
    router.get('/test', () => {
      return data;
    });

    serviceProvider.registerRoutes(router);

    const middleware = app.middleware[0];

    const nextFunction = vi.fn();

    await middleware(request, response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(response.getHeaders()['content-type']).toBe(
      'application/json; charset=utf-8',
    );
  });

  it('should handle handler not found error', async () => {
    const request = new Request(new Socket());
    request.app = app;
    request.url = '/nonexistent';
    request.method = 'GET';

    const response = new Response(request);
    response.app = app;

    serviceProvider.handlerNotFoundError();

    await app.middleware[0](request, response);

    expect(response.statusCode).toBe(404);
  });

  it('should register routes and execute route handler', async () => {
    const routeHandler = () => 'Hello, World!';
    router.get('test', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = 'test';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true;
    };

    // Use the testable app for testing
    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('Hello, World!');
  });

  it('should handle handlerNotFoundError when route is not found', async () => {
    serviceProvider.handlerNotFoundError();

    request.method = 'GET';
    request.url = '/nonexistent-route';

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    // Use the testable app for testing
    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe(
      JSON.stringify({
        success: false,
        message: 'Route not found',
        statusCode: 404,
      }),
    );
  });

  it('should handle route returning an object', async () => {
    const routeHandler = () => ({
      message: 'Hello, World!',
    });
    router.get('test', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = 'test';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('{"message":"Hello, World!"}');
    expect(response.getHeaders()['content-type']).toBe(
      'application/json; charset=utf-8',
    );
  });

  it('should handle route returning null or undefined', async () => {
    const routeHandler = () => null;
    router.get('/', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = '/';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('');
    expect(response.getHeaders()['content-type']).toBeUndefined();
  });

  it('should handle route returning number', async () => {
    const routeHandler = () => 123;
    router.get('test', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = 'test';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('123');
    expect(response.getHeaders()['content-type']).toBeUndefined();
  });

  it('should handle route returning not stringable object', async () => {
    const routeHandler = () => ({
      data: 'value',
      toString: () => null,
    });
    router.get('test', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = 'test';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('{"data":"value"}');
  });

  it('should handle route returning Jsonable object', async () => {
    const routeHandler = () => ({
      toJSON: () => 'some value',
    });
    router.get('test', routeHandler);
    serviceProvider.registerRoutes(router);

    request.method = 'GET';
    request.url = 'test';
    request.app = app;

    let writtenData = '';
    response.write = (data: string) => {
      writtenData = data;
      return true; // response.write should return boolean
    };

    const httpKernel = serviceProvider
      .getTestableApp()
      .make<HttpKernel>('HttpKernel');
    await httpKernel.handle(request, response);

    expect(writtenData).toBe('some value');
    expect(response.getHeaders()['content-type']).toBe(
      'application/json; charset=utf-8',
    );
  });
});
