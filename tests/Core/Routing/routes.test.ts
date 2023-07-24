import { Request, Route, Router } from '@/Core';
import { Socket } from 'net';
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
    expect((getRoute as Route).httpVerb).toEqual(['get', 'head']);
    expect((getRoute as Route).action).toEqual([func]);

    const postRoute = router.routes[1];
    expect((postRoute as Route).uri).toEqual(['test']);
    expect((postRoute as Route).httpVerb).toEqual(['post']);
    expect((postRoute as Route).action).toEqual([func]);
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
    expect(router.match(request)).toBe(getRoute);

    request.method = 'post';
    expect(router.match(request)).toBe(postRoute);
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

    const matchedRoute = router.match(request);
    (matchedRoute as Route).execute(request, null);
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

    const matchedRoute = router.match(request);
    (matchedRoute as Route).execute(request, null, next);
    expect(func).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
