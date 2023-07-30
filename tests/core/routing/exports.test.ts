import { Router } from '@/core';
import { METHODS } from 'node:http';
import { describe, expect, it } from 'vitest';

describe('exports from Router', () => {
  it('should be invocable', () => {
    const router = new Router();
    expect(Router).toBeTypeOf('function');
    expect(router).toBeTypeOf('object');
  });

  it('should have a `routes` property', () => {
    const router = new Router();
    expect(router.routes).toBeDefined();
  });

  it('should have methods for all HTTP verbs', () => {
    const router = new Router();
    const httpVerbs = METHODS.filter((el) => el !== 'M-SEARCH');
    for (const method of httpVerbs) {
      expect(router[method.toLowerCase()]).toBeDefined();
      expect(router[method.toLowerCase()]).toBeTypeOf('function');
    }
  });

  it('should have methods to add generic routes', () => {
    const router = new Router();
    const methods = ['any', 'all', 'anyOf'];
    for (const method of methods) {
      expect(router[method]).toBeDefined();
      expect(router[method]).toBeTypeOf('function');
    }
  });

  it('should have method to match a route with the request', () => {
    const router = new Router();
    expect(router.match).toBeDefined();
    expect(router.match).toBeTypeOf('function');
  });

  it('should be able to create routes groups', () => {
    const router = new Router();
    const methods = ['group', 'middleware', 'prefix'];
    for (const method of methods) {
      expect(router[method]).toBeDefined();
      expect(router[method]).toBeTypeOf('function');
    }
  });
});
