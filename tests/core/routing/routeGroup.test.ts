import { Request, Response } from '@/core';
import { Route, RoutesGroup } from '@/core/routing';
import { Socket } from 'net';
import { expect, it, vi } from 'vitest';

it('should create a group and return it', async () => {
  const router = new RoutesGroup();
  const testFunc = vi.fn();
  const group = router.group(testFunc);
  expect(group).toBeInstanceOf(RoutesGroup);
  expect(testFunc).toBeCalledTimes(1);
});

it('should create a group with the attributes as input', async () => {
  const router = new RoutesGroup();
  const testFunc = vi.fn();
  const group = router.group(
    { prefix: 'pre', middleware: async () => {} },
    testFunc,
  );
  expect(group.prefix).toBe('pre');
  expect(group.middlewareLayers).toHaveLength(1);
});

it('should create a group with the attributes as input', async () => {
  const router = new RoutesGroup({
    prefix: 'pre1',
    middleware: async () => {},
  });
  const testFunc = vi.fn();
  const group = router.group(
    { prefix: 'pre2', middleware: async () => {} },
    testFunc,
  );
  expect(group.prefix).toBe('pre1/pre2');
  expect(group.middlewareLayers).toHaveLength(2);
});

it('should get matched routes successfully', async () => {
  const router = new RoutesGroup();
  const testFunc = vi.fn();
  router.get('/test', testFunc);

  const request = new Request(new Socket());
  request.url = '/test';
  request.method = 'GET';
  const response = new Response(request);

  const matchedRoutes = await router.match(request, response);
  expect(matchedRoutes).toBeInstanceOf(Route);
});

it('should return false when no route is matched', async () => {
  const router = new RoutesGroup();
  const testFunc = vi.fn();
  router.get('/test', testFunc);

  const request = new Request(new Socket());
  request.url = '/not-found';
  request.method = 'GET';
  const response = new Response(request);

  const matchedRoutes = await router.match(request, response);
  expect(matchedRoutes).toBe(false);
});

it('should create a group the same middleware layers', async () => {
  const router = new RoutesGroup();
  const testFunc = vi.fn();
  const group = router.middleware(testFunc);

  expect(group.middlewareLayers).toHaveLength(1);
});

it('should add routes to the group', async () => {
  const group = new RoutesGroup();

  const testFunc = vi.fn();
  group.get('/test', testFunc);

  expect(group.routes).toHaveLength(1);
});

it('should add routes to the group with the same middleware layers', async () => {
  const group = new RoutesGroup();

  const testFunc = vi.fn();
  group.get('/test', testFunc);

  expect(group.routes).toHaveLength(1);
});

it('should add routes to the group with the same prefix', async () => {
  const group = new RoutesGroup({ prefix: 'pre' });

  const testFunc = vi.fn();
  group.get('/test', testFunc);

  expect(group.routes).toHaveLength(1);
  expect((group.routes[0] as Route).prefixUri).toBe('pre');
});
