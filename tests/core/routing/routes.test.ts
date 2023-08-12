import { Request, Route, Router } from '@/core';
import { makeFunctionsChain } from '@/utils/helpers/makeFunctionsChain';
import exp from 'node:constants';
import { METHODS } from 'node:http';
import { Socket } from 'node:net';
import { describe, expect, it, vi } from 'vitest';

describe('Make routes and test if they works as expected', () => {
  it('should make routes and store them in routes property', () => {
    const router = new Router();
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
    const router = new Router();
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const getRoute = router.routes[0];
    expect((getRoute as Route).uri).toEqual(['test']);
    expect((getRoute as Route).httpMethods).toEqual(['get', 'head']);
    expect((getRoute as Route).actions).toEqual([func]);

    const postRoute = router.routes[1];
    expect((postRoute as Route).uri).toEqual(['test']);
    expect((postRoute as Route).httpMethods).toEqual(['post']);
    expect((postRoute as Route).actions).toEqual([func]);
  });

  it('should return the matched routes when making the request', () => {
    const router = new Router();
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const getRoute = router.routes[0];
    const postRoute = router.routes[1];

    const request = new Request(new Socket());
    request.url = '/test';

    request.method = 'get';
    expect(router.match(request)).toEqual([getRoute]);

    request.method = 'post';
    expect(router.match(request)).toEqual([postRoute]);
  });

  it('should return false when making the request and no routes match', () => {
    const router = new Router();
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const request = new Request(new Socket());
    request.url = '/test';

    request.method = 'put';
    expect(router.match(request)).toBeFalsy();
  });

  it('should call the actions of the matched route when making the request', () => {
    const router = new Router();
    const func = vi.fn();
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'get';

    const matchedRoutes = router.match(request);
    expect(matchedRoutes).toHaveLength(1);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the next function when making the request', () => {
    const router = new Router();
    const next = vi.fn();
    const func = vi.fn(next);
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'get';

    const matchedRoutes = router.match(request);
    expect(matchedRoutes).toHaveLength(1);
    (matchedRoutes[0] as Route).dispatch(request, null, next);
    expect(func).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should add all methods to the router', () => {
    const router = new Router();
    router.all('/test', () => 'response value');
    router.any('/test-2', () => 'response value');

    const routeAll = router.routes[0];
    const routeAny = router.routes[1];

    const methods = METHODS.map((m) => m.toLowerCase());

    expect(routeAll).toBeInstanceOf(Route);
    expect((routeAll as Route).httpMethods).toEqual(methods);

    expect(routeAny).toBeInstanceOf(Route);
    expect((routeAny as Route).httpMethods).toEqual(methods);
  });

  it('should add all routes with all methods', () => {
    const router = new Router();
    const allMethods = [
      ...METHODS.filter((m) => m !== 'M-SEARCH').map((m) => m.toLowerCase()),
    ];

    // add a route for every HTTP method
    for (const method of allMethods) {
      router[method.toLowerCase()]('/test', () => 'response value');
    }

    expect(router.routes.length).toBe(allMethods.length);

    for (const route of router.routes) {
      for (const method of (route as Route).httpMethods) {
        if (method === 'm-search') continue;
        expect(allMethods.includes(method)).toBeTruthy();
      }
    }
  });

  it('should return false if there is no matched route', () => {
    const router = new Router();
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/another-url';
    request.method = 'get';

    expect(router.match(request)).toBeFalsy();
  });

  it('should return false if there is no matched route for any method', () => {
    const router = new Router();
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'post';

    expect(router.match(request)).toBeFalsy();
  });

  it('should not stack overflow with a large sync stack of routes', () => {
    const router = new Router();
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
    request.method = 'get';
    const matchedRoutes = router.match(request);
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
    const router = new Router();

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
    request.method = 'get';
    const matchedRoutes = router.match(request);
    expect(matchedRoutes).toHaveLength(1);

    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(6000);
    expect(request.locals.called).toBeTruthy();
    expect(matchedRoutes).toBeTruthy();
  });

  it('should call a stack of actions with the same request', () => {
    const request = new Request(new Socket());
    request.url = '/test-stack';
    request.method = 'get';
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

    const router = new Router();
    router.get('/test-stack', stack);

    const matchedRoutes = router.match(request);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(2);
  });

  it('should call a stack of routes from multiple routers with the same request', () => {
    const request = new Request(new Socket());
    request.url = '/test-stack';
    request.method = 'get';

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

    const router = new Router();
    router.use(routerA);
    router.use(routerB);
    router.use(routerC);
    router.dispatch(request, null);

    expect(testFunc).toBeCalledTimes(3);
    expect(request.locals.counter).toBe(2);
  });
});
