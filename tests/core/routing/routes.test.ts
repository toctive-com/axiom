import { Request, Response, Route, Router, RoutesGroup } from '@/core';
import { makeFunctionsChain } from '@/utils/helpers/makeFunctionsChain';
import { METHODS } from 'node:http';
import { Socket } from 'node:net';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Make routes and test if they works as expected', () => {
  let router: Router;

  beforeEach(() => {
    router = new Router(); // Create a new Router instance before each test
  });

  it('should make routes and store them in routes property', () => {
    router.get('/test', () => 'GET - response value');
    router.post('/test', () => 'POST - response value');
    router.put('/test', () => 'PUT - response value');
    router.delete('/test', () => 'DELETE - response value');
    expect(router.routes.length).toBe(4);

    for (let i = 0; i < router.routes.length; i++) {
      const route = router.routes[i];
      expect(route).toBeInstanceOf(Route);
    }
  });

  it('should make routes and make the URI, Actions & HTTP method as arrays', () => {
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const getRoute = router.routes[0];
    expect((getRoute as Route).uri).toEqual(['test']);
    expect((getRoute as Route).httpMethods).toEqual(['GET', 'HEAD']);
    expect((getRoute as Route).actions).toEqual([func]);

    const postRoute = router.routes[1];
    expect((postRoute as Route).uri).toEqual(['test']);
    expect((postRoute as Route).httpMethods).toEqual(['POST']);
    expect((postRoute as Route).actions).toEqual([func]);
  });

  it('should return the matched routes when making the request', () => {
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const getRoute = router.routes[0];
    const postRoute = router.routes[1];

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);
    expect(router.match(request, response)).toEqual([getRoute]);

    request.method = 'POST';
    expect(router.match(request, response)).toEqual([postRoute]);
  });

  it('should return false when making the request and no routes match', () => {
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'PUT';

    const response = new Response(request);
    expect(router.match(request, response)).toBeFalsy();
  });

  it('should call the actions of the matched route when making the request', () => {
    const func = vi.fn();
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);
    expect(matchedRoutes).toHaveLength(1);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the next function when making the request', () => {
    const next = vi.fn();
    const func = vi.fn(next);
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);
    expect(matchedRoutes).toHaveLength(1);
    (matchedRoutes[0] as Route).dispatch(request, null, next);
    expect(func).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should add all methods to the router', () => {
    router.all('/test', () => 'response value');
    router.any('/test-2', () => 'response value');

    const routeAll = router.routes[0];
    const routeAny = router.routes[1];

    const methods = METHODS;

    expect(routeAll).toBeInstanceOf(Route);
    expect((routeAll as Route).httpMethods).toEqual(methods);

    expect(routeAny).toBeInstanceOf(Route);
    expect((routeAny as Route).httpMethods).toEqual(methods);
  });

  it('should add all routes with all methods', () => {
    const allMethods = [...METHODS.filter((m) => m !== 'M-SEARCH')];

    // add a route for every HTTP method
    for (const method of allMethods) {
      router[method.toLowerCase()]('/test', () => 'response value');
    }

    expect(router.routes.length).toBe(allMethods.length);

    for (const route of router.routes) {
      for (const method of (route as Route).httpMethods) {
        if (method === 'M-SEARCH') continue;
        expect(allMethods.includes(method)).toBeTruthy();
      }
    }
  });

  it('should add route with m-search HTTP method', () => {
    router.mSearch('/test', () => 'response value');

    const route = router.routes[0];
    expect(route).toBeInstanceOf(Route);
    expect((route as Route).httpMethods).toEqual(['M-SEARCH']);
  });

  it('should add route with all wanted methods', () => {
    router.anyOf(['GET', 'POST', 'ACL'], '/test', () => 'response value');

    const route = router.routes[0];
    expect(route).toBeInstanceOf(Route);
    expect((route as Route).httpMethods).toEqual(['GET', 'POST', 'ACL']);
  });

  it('should add route with get only http method', () => {
    router.getOnly('/test', () => 'response value');

    const route = router.routes[0];
    expect(route).toBeInstanceOf(Route);
    expect((route as Route).httpMethods).toEqual(['GET']);
  });

  it('should return false if there is no matched route', () => {
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/another-url';
    request.method = 'GET';

    const response = new Response(request);

    expect(router.match(request, response)).toBeFalsy();
  });

  it('should return false if there is no matched route for any method', () => {
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'post';

    const response = new Response(request);

    expect(router.match(request, response)).toBeFalsy();
  });

  it('should not stack overflow with a large sync stack of routes', () => {
    const stackSize = 10000;
    const testFunc = vi.fn();

    router.get('/test', ({ req, next }) => {
      req.locals.counter = 0;
      next();
    });

    for (var i = 0; i < stackSize; i++) {
      const r = router.any('/test', ({ req, next }) => {
        req.locals.counter++;
        testFunc();
        return next();
      });
    }

    router.get('/test', ({ req }) => {
      req.locals.called = true;
    });

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);
    expect(matchedRoutes).toHaveLength(stackSize + 2);

    if (matchedRoutes === false) return;

    const nextFunctions = matchedRoutes
      .slice(1)
      .map((r) => r.actions)
      .flat();
    expect(nextFunctions).toHaveLength(stackSize + 1);

    const nextFunctionsStack = makeFunctionsChain(nextFunctions, {
      req: request,
      res: null,
    });

    (matchedRoutes[0] as Route).dispatch(request, null, nextFunctionsStack);
    expect(request.locals.counter).toBe(stackSize);
    expect(request.locals.called).toBeTruthy();
    expect(matchedRoutes).toBeTruthy();
    expect(testFunc).toBeCalledTimes(stackSize);
  });

  it('should not stack overflow with a large sync stacked functions', () => {
    const middleware = [];
    for (var i = 0; i < 6000; i++) {
      middleware.push(({ req, next }) => {
        req.locals.counter++;
        next();
      });
    }

    router.get('/test', [
      ({ req, next }) => {
        req.locals.counter = 0;
        next();
      },
      ...middleware,
      ({ req }) => (req.locals.called = true),
    ]);

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);
    expect(matchedRoutes).toHaveLength(1);

    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(6000);
    expect(request.locals.called).toBeTruthy();
    expect(matchedRoutes).toBeTruthy();
  });

  it('should call a stack of actions with the same request', () => {
    const request = new Request(new Socket());
    request.url = '/test-stack';
    request.method = 'GET';
    const stack = [
      ({ req, next }) => {
        req.locals.counter = 0;
        next();
      },
      ({ req, next }) => {
        req.locals.counter++;
        next();
      },
      ({ req, next }) => {
        req.locals.counter++;
        next();
      },
    ];

    router.get('/test-stack', stack);

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(2);
  });

  it('should call a stack of routes from multiple routers with the same request', () => {
    const request = new Request(new Socket());
    request.url = '/test-stack';
    request.method = 'GET';

    const testFunc = vi.fn();
    const stack = [
      ({ req, next }) => {
        testFunc();
        req.locals.counter = 0;
        next();
      },
      ({ req, next }) => {
        testFunc();
        req.locals.counter++;
        next();
      },
      ({ req, next }) => {
        testFunc();
        req.locals.counter++;
        next();
      },
    ];

    const routerA = new Router();
    routerA.get('/test-stack', stack[0]);
    const routerB = new Router();
    routerB.get('/test-stack', stack[1]);
    const routerC = new Router();
    routerC.get('/test-stack', stack[2]);

    router.use(routerA);
    router.use(routerB);
    router.use(routerC);
    router.dispatch(request, null);

    expect(testFunc).toBeCalledTimes(3);
    expect(request.locals.counter).toBe(2);
  });

  it('should handle errors thrown by the action', async () => {
    router.get('/test', () => {
      throw new Error('test error');
    });

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const result = await router.dispatch(request, new Response(request));
    expect(result).toHaveProperty('message', 'test error');
    expect(result).toHaveProperty('success', false);
  });

  it('should have all HTTP methods', () => {
    expect(Router.httpMethods).toEqual([
      'ACL',
      'BIND',
      'CHECKOUT',
      'CONNECT',
      'COPY',
      'DELETE',
      'GET',
      'HEAD',
      'LINK',
      'LOCK',
      'M-SEARCH',
      'MERGE',
      'MKACTIVITY',
      'MKCALENDAR',
      'MKCOL',
      'MOVE',
      'NOTIFY',
      'OPTIONS',
      'PATCH',
      'POST',
      'PROPFIND',
      'PROPPATCH',
      'PURGE',
      'PUT',
      'REBIND',
      'REPORT',
      'SEARCH',
      'SOURCE',
      'SUBSCRIBE',
      'TRACE',
      'UNBIND',
      'UNLINK',
      'UNLOCK',
      'UNSUBSCRIBE',
    ]);
  });

  it('should add middleware to routes group', () => {
    const middlewareFn = () => {};

    const routesGroup = router.middleware(middlewareFn);

    expect(routesGroup).toBeDefined();
    expect(router.routes.length).toBe(1);
  });

  it('should add prefix to routes group', () => {
    const prefix = '/api';

    const routesGroup = router.prefix(prefix);

    expect(routesGroup).toBeDefined();
    expect(router.routes.length).toBe(1);
  });

  it('should handle empty route list when matching', () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);

    expect(matchedRoutes).toBe(false);
  });

  it('should add sub-router and use its routes', () => {
    const subRouter = new Router();
    const route = subRouter.get('/sub-test', () => {});

    const routesGroup = router.use(subRouter);

    expect(routesGroup).toBeDefined();
    expect(router.routes.length).toBe(1);
    expect((router.routes[0] as RoutesGroup).routes[0]).toBe(route);
  });

  it('should correctly handle dispatch error', async () => {
    const request = new Request(new Socket());
    request.url = '/error';
    request.method = 'GET';
    const response = new Response(request);

    router.get('/error', () => {
      throw new Error('Test Error');
    });

    const dispatchResult = await router.dispatch(request, response);

    expect(dispatchResult).toEqual({
      success: false,
      message: 'Test Error',
      stack: expect.arrayContaining(['Error: Test Error']),
    });
    expect(response.statusCode).toBe(500);
    expect(response.statusMessage).toBe('Internal Server Error');
  });

  it('should create and use route groups with attributes', () => {
    const routesGroup = router.group({ prefix: '/api' }, (group) => {
      group.get('/users', () => {});
    });

    expect(routesGroup).toBeDefined();
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].prefix).toBe('api');
    expect((router.routes[0] as RoutesGroup).routes.length).toBe(1);
  });

  it('should create and use route groups without attributes', () => {
    const routesGroup = router.group((group) => {
      group.get('/posts', () => {});
    });

    expect(routesGroup).toBeDefined();
    expect(router.routes.length).toBe(1);
    expect((router.routes[0] as RoutesGroup).routes.length).toBe(1);
  });

  it('should match multiple routes', () => {
    const request = new Request(new Socket());
    request.url = '/common';
    request.method = 'GET';

    const route1 = router.get('/common', () => {});
    const route2 = router.get('/common', () => {});

    const response = new Response(request);

    const matchedRoutes = router.match(request, response);

    expect(matchedRoutes).toHaveLength(2);
    expect(matchedRoutes[0]).toBe(route1);
    expect(matchedRoutes[1]).toBe(route2);
  });

  it('should handle middleware in a route', async () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

    let middlewareCalled = false;

    const middleware = ({ next }) => {
      middlewareCalled = true;
      next();
    };

    const route = router.get('/test', () => {});
    route.middleware(middleware);

    await router.dispatch(request, response);

    expect(middlewareCalled).toBe(true);
  });

  it('should handle nested middleware in route group', async () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

    let middleware1Called = false;
    let middleware2Called = false;

    const testFunc = vi.fn();
    const middleware1 = ({ next }) => {
      middleware1Called = true;
      testFunc();
      return next();
    };

    const middleware2 = ({ next }) => {
      middleware2Called = true;
      testFunc();
      return next();
    };

    router
      .middleware(middleware1)
      .get('/test', () => {})
      .middleware(middleware2);

    await router.dispatch(request, response);

    expect(testFunc).toBeCalledTimes(2);
    expect(middleware1Called).toBe(true);
    expect(middleware2Called).toBe(true);
  });

  it('should call next function if no route is matched', async () => {
    const request = new Request(new Socket());
    request.url = '/nonexistent';
    request.method = 'GET';
    const response = new Response(request);

    const nextFn = vi.fn();

    const dispatchResult = await router.dispatch(request, response, nextFn);

    expect(dispatchResult).toBeUndefined();
    expect(nextFn).toHaveBeenCalled();
  });

  it('should return null if no route is matched and no next function', async () => {
    const request = new Request(new Socket());
    request.url = '/nonexistent';
    request.method = 'GET';
    const response = new Response(request);

    const dispatchResult = await router.dispatch(request, response);

    expect(dispatchResult).toBeNull();
  });

  it('should execute matched route and call next function', async () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';
    const response = new Response(request);

    let routeExecuted = false;
    let nextFunctionCalled = false;

    router.get('/test', ({ next }) => {
      routeExecuted = true;
      next();
    });

    const nextFunction = () => {
      nextFunctionCalled = true;
    };

    const dispatchResult = await router.dispatch(
      request,
      response,
      nextFunction,
    );

    expect(dispatchResult).toBeUndefined();
    expect(routeExecuted).toBe(true);
    expect(nextFunctionCalled).toBe(true);
  });
});
