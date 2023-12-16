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

  it('should return the matched routes when making the request', async () => {
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const getRoute = router.routes[0];
    const postRoute = router.routes[1];

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);
    expect(await router.match(request, response)).toEqual([getRoute]);

    request.method = 'POST';
    expect(await router.match(request, response)).toEqual([postRoute]);
  });

  it('should return false when making the request and no routes match', async () => {
    const func = vi.fn();
    router.get('/test', func);
    router.post('/test', func);

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'PUT';

    const response = new Response(request);
    expect(await router.match(request, response)).toBeFalsy();
  });

  it('should call the actions of the matched route when making the request', async () => {
    const func = vi.fn();
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = await router.match(request, response);
    expect(matchedRoutes).toHaveLength(1);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the next function when making the request', async () => {
    const next = vi.fn();
    const func = vi.fn(next);
    router.get('/test', func);

    expect(func).not.toHaveBeenCalled();

    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = await router.match(request, response);
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

  it('should return false if there is no matched route', async () => {
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/another-url';
    request.method = 'GET';

    const response = new Response(request);

    expect(await router.match(request, response)).toBeFalsy();
  });

  it('should return false if there is no matched route for any method', async () => {
    router.get('/test', () => 'response value');
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'post';

    const response = new Response(request);

    expect(await router.match(request, response)).toBeFalsy();
  });

  it('should not stack overflow with a large sync stack of routes', async () => {
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

    const matchedRoutes = await router.match(request, response);
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

  it('should not stack overflow with a large sync stacked functions', async () => {
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

    const matchedRoutes = await router.match(request, response);
    expect(matchedRoutes).toHaveLength(1);

    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(6000);
    expect(request.locals.called).toBeTruthy();
    expect(matchedRoutes).toBeTruthy();
  });

  it('should call a stack of actions with the same request', async () => {
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

    const matchedRoutes = await router.match(request, response);
    (matchedRoutes[0] as Route).dispatch(request, null);
    expect(request.locals.counter).toBe(2);
  });

  it('should call a stack of routes from multiple routers with the same request', async () => {
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
    await router.dispatch(request, null);

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

  it('should handle empty route list when matching', async () => {
    const request = new Request(new Socket());
    request.url = '/test';
    request.method = 'GET';

    const response = new Response(request);

    const matchedRoutes = await router.match(request, response);

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

  it('should match multiple routes', async () => {
    const request = new Request(new Socket());
    request.url = '/common';
    request.method = 'GET';

    const route1 = router.get('/common', () => {});
    const route2 = router.get('/common', () => {});

    const response = new Response(request);

    const matchedRoutes = await router.match(request, response);

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

  it('should extract variables from URLs', () => {
    let extractVariablesMock: (
      originalUrl: string,
      currentUrl: string,
    ) => Object;
    class MockRoute extends Route {
      constructor(
        public httpMethods: string[],
        public uri: string[],
        public actions: Function[],
      ) {
        super(httpMethods, uri, actions);
        extractVariablesMock = this.extractVariables;
      }
    }
    new MockRoute(['GET'], ['/{id}/{slug}', '/post/:postId'], []);

    const originalUrl = '{id}/{slug}';
    const currentUrl = '123/my-post';

    const variables = extractVariablesMock(originalUrl, currentUrl);
    expect(variables).toEqual({ id: '123', slug: 'my-post' });
  });

  it('should get the matched URI from a list of URIs', () => {
    const route = new Route(['GET'], ['/post/:postId', '/{id}/{slug}'], []);

    const currentUrl = 'post/123';

    const matchedUri = route.getMatchedUri(currentUrl);
    expect(matchedUri).toEqual('post/:postId');
  });

  it('should call all middleware layers', async () => {
    const mockRequest = new Request(new Socket());
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], [], []);
    const middleware1 = vi.fn(({ next }) => next());
    const middleware2 = vi.fn();
    route.middleware([middleware1, middleware2]);

    await route.isMiddlewareAllowed(mockRequest, mockResponse);

    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalled();
  });

  it('should dispatch route actions', async () => {
    const mockRequest = new Request(new Socket());
    mockRequest.url = '/post/123';
    mockRequest.method = 'GET';
    const mockResponse = new Response(mockRequest);
    const route = new Route(
      ['GET'],
      ['post/:postId'],
      [
        async ({ response, postId }) => {
          response.send(`Post ID: ${postId}`);
        },
      ],
    );

    const sendSpy = vi.spyOn(mockResponse, 'send');

    await route.dispatch(mockRequest, mockResponse);

    expect(sendSpy).toHaveBeenCalledWith('Post ID: 123');
  });

  it('should add middleware layers', () => {
    let middlewareLayers: Function[] = [];
    class MockRoute extends Route {
      constructor(
        public httpMethods: string[],
        public uri: string[],
        public actions: Function[],
      ) {
        super(httpMethods, uri, actions);
        middlewareLayers = this.middlewareLayers;
      }
    }
    const route = new MockRoute(['GET'], [], []);

    const middleware1 = () => {};
    const middleware2 = () => {};

    route.middleware([middleware1, middleware2]);

    expect(middlewareLayers).toEqual([middleware1, middleware2]);
  });

  it('should set the name of the route', () => {
    let routeNameMocked: () => string;
    class MockRoute extends Route {
      constructor(
        public httpMethods: string[],
        public uri: string[],
        public actions: Function[],
      ) {
        super(httpMethods, uri, actions);
        routeNameMocked = () => this.routeName;
      }
    }
    const route = new MockRoute(['GET'], [], []);

    const routeName = 'myRoute';
    route.named(routeName);

    expect(routeNameMocked()).toBe(routeName);
  });

  it('should set the prefix URI of the route', () => {
    const route = new Route(['GET'], [], []);

    const prefixUri = 'api';
    route.prefix(prefixUri);

    expect(route.prefixUri).toBe(prefixUri);
  });

  it('should return false when dispatch is not allowed', async () => {
    const mockRequest = new Request(new Socket());
    mockRequest.url = '/post/123';
    mockRequest.method = 'GET';
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], ['/'], []);

    // Assume the middleware doesn't allow the dispatch
    route.middleware((req, res, next) => {
      // In this case, middleware returns false, preventing dispatch
      return false;
    });

    const result = await route.dispatch(mockRequest, mockResponse);

    expect(result).toBe(undefined);
  });

  it('should correctly match URI using isUriMatches', () => {
    const mockRequest = new Request(new Socket());
    mockRequest.method = 'GET';
    const route = new Route(['GET'], ['/users/{id}', 'articles/:slug'], []);

    // URL matches the first URI pattern
    mockRequest.url = '/users/123';
    expect(route.isUriMatches(mockRequest)).toBe(true);

    // URL matches the second URI pattern
    mockRequest.url = 'articles/article-title';
    expect(route.isUriMatches(mockRequest)).toBe(true);

    // URL doesn't match any of the URI patterns
    mockRequest.url = '/random';
    expect(route.isUriMatches(mockRequest)).toBe(false);
  });

  it('should extract variables from URI using extractVariables', () => {
    const mockRequest = new Request(new Socket());
    mockRequest.method = 'GET';
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], ['/users/{id}', '/articles/:slug'], []);

    // URL matches the first URI pattern
    const originalUrl = '/users/{id}';
    const currentUrl = '/users/123';
    const expectedVariables = { id: '123' };
    const variables = route.extractVariables(originalUrl, currentUrl);
    expect(variables).toEqual(expectedVariables);

    // URL matches the second URI pattern
    const originalUrl2 = '/articles/:slug';
    const currentUrl2 = '/articles/article-title';
    const expectedVariables2 = { slug: 'article-title' };
    const variables2 = route.extractVariables(originalUrl2, currentUrl2);
    expect(variables2).toEqual(expectedVariables2);
  });

  it('should return false if dispatch does not match URI', async () => {
    const mockRequest = new Request(new Socket());
    mockRequest.method = 'GET';
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], ['/users/{id}', '/articles/:slug'], []);
    mockRequest.url = '/random';
    const result = await route.dispatch(mockRequest, mockResponse);
    expect(result).toBe(undefined);
  });

  it('should call functions in sequence using callFunctions', async () => {
    const mockRequest = new Request(new Socket());
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], ['/users/{id}'], []);

    const actions = [
      async (context: any) => {
        context.req.locals.data = 'A';
        await context.next();
      },
      async (context: any) => {
        context.req.locals.data += 'B';
        await context.next();
      },
      async (context: any) => {
        context.req.locals.data += 'C';
        await context.next();
      },
    ];

    mockRequest.url = '/users/123';
    const context = {
      request: mockRequest,
      response: mockResponse,
      data: '',
    };

    await route.callFunctions(
      actions,
      context.request,
      context.response,
      context,
    );
    expect(context.request.locals.data).toBe('ABC');
  });

  it('should stop calling functions when next is not called', async () => {
    const mockRequest = new Request(new Socket());
    const mockResponse = new Response(mockRequest);
    const route = new Route(['GET'], ['/users/{id}'], []);

    const actions = [
      async (context: any) => {
        context.req.locals.data = 'A';
        // next() is not called
      },
      async (context: any) => {
        context.data += 'B';
        await context.next();
      },
      async (context: any) => {
        context.data += 'C';
        await context.next();
      },
    ];

    mockRequest.url = '/users/123';
    const context = {
      request: mockRequest,
      response: mockResponse,
      data: '',
    };

    const result = await route.callFunctions(
      actions,
      context.request,
      context.response,
      context,
    );
    expect(context.request.locals.data).toBe('A');
  });
});
