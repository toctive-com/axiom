import {
  Application,
  Request,
  Response,
  Route,
  Router,
  RoutesGroup,
} from '@/core';
import { makeFunctionsChain } from '@/utils/helpers/makeFunctionsChain';
import { METHODS } from 'node:http';
import { Socket } from 'node:net';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouteServiceProvider } from '@/core/routing/RouteServiceProvider';
import TestApp from 'tests/TestApp';

describe('RouteServiceProvider', () => {
  let serviceProvider: RouteServiceProvider;
  let router: Router;
  let app: Application;

  beforeEach(async () => {
    router = new Router(); // Create a new Router instance before each test
    app = await TestApp();
    serviceProvider = new RouteServiceProvider(app);
  });

  it('should register routes and execute matched route', async () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

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
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

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
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

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
    request.url = '/nonexistent';
    request.method = 'GET';
    const response = new Response(request);

    serviceProvider.handlerNotFoundError();

    const middleware = app.middleware[0];
    await middleware(request, response);

    expect(response.statusCode).toBe(404);
  });
});
