import { Url } from '../../../src';
import { expect, it } from 'vitest';

it('should trim the extra slashes', () => {
  expect(Url.trim('/foo/bar/')).toBe('foo/bar');
  expect(Url.trim('///foo/bar/')).toBe('foo/bar');
  expect(Url.trim('///foo/bar///')).toBe('foo/bar');
});

it('should join the segments', () => {
  expect(Url.join('foo', 'bar', 'baz')).toBe('foo/bar/baz');

  expect(Url.join('/foo', 'bar', 'baz')).toBe('foo/bar/baz');
  expect(Url.join('foo', '/bar', 'baz')).toBe('foo/bar/baz');
  expect(Url.join('foo', 'bar', '/baz')).toBe('foo/bar/baz');

  expect(Url.join('/foo//', 'bar', 'baz')).toBe('foo/bar/baz');
  expect(Url.join('/foo//', '/bar', 'baz')).toBe('foo/bar/baz');
  expect(Url.join('/foo//', 'bar', '/baz')).toBe('foo/bar/baz');

  expect(Url.join('/foo//', '/bar', 'baz//')).toBe('foo/bar/baz');
  expect(Url.join('/foo//', '//bar', 'baz//')).toBe('foo/bar/baz');
  expect(Url.join('/foo//', '/bar', '/baz//')).toBe('foo/bar/baz');

  expect(Url.join('foo', '/bar/', '/baz')).toBe('foo/bar/baz');
  expect(Url.join('foo', '/bar/', 'baz')).toBe('foo/bar/baz');
  expect(Url.join('foo', '/bar/', '/baz/')).toBe('foo/bar/baz');
});
