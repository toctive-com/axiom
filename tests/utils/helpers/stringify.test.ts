import { stringify } from '@/utils';
import { describe, expect, it } from 'vitest';

describe('convert all data type correctly like JSON.stringify', () => {
  it('should correctly convert a null value to a string', () => {
    const obj = null;
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a number value to a string', () => {
    const obj = 1;
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a boolean value to a string', () => {
    const obj = true;
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a string value to a string', () => {
    const obj = 'foo';
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert an array value to a string', () => {
    const obj = ['foo', 'bar'];
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert an object to a string', () => {
    const obj = { foo: 'bar', baz: 'qux' };
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a function value to a string', () => {
    const obj = () => {};
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a symbol value to a string', () => {
    const obj = Symbol('foo');
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a date value to a string', () => {
    const obj = new Date();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a map value to a string', () => {
    const obj = new Map();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a set value to a string', () => {
    const obj = new Set();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a weakmap value to a string', () => {
    const obj = new WeakMap();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a weakset value to a string', () => {
    const obj = new WeakSet();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });

  it('should correctly convert a promise value to a string', () => {
    const obj = Promise.resolve();
    expect(stringify(obj)).toBe(JSON.stringify(obj));
  });
});

it('should correctly convert an object to a string with indentation', () => {
  const obj = {
    foo: 'bar',
    baz: 'qux',
  };

  expect(stringify(obj, 2)).toBe(JSON.stringify(obj, null, 2));
});

it('should handle circular references correctly', () => {
  const obj = {
    foo: 'bar',
    baz: 'qux',
    circular: {},
  };

  obj.circular = obj;

  expect(stringify(obj)).toEqual('{"foo":"bar","baz":"qux"}');
});
