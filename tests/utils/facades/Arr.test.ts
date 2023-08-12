import { Arr } from '@/utils/facades';
import { expect, it } from 'vitest';

it('should return the input value as an array if it is already an array', () => {
  const input = [1, 2, 3];
  const result = Arr.wrap(input);
  expect(result).toEqual(input);
});

it('should return an empty array if the input value is undefined', () => {
  const input = undefined;
  const result = Arr.wrap(input);
  expect(result).toEqual([]);
});

it('should return an empty array if the input value is null', () => {
  const input = null;
  const result = Arr.wrap(input);
  expect(result).toEqual([]);
});

it('should wrap the input value in an array if it is not an array, undefined, or null', () => {
  const input = 123;
  const result = Arr.wrap(input);
  expect(result).toEqual([input]);
});

it('should wrap the input value in an array if it is not an array, undefined, or null', () => {
  const input = '123';
  const result = Arr.wrap(input);
  expect(result).toEqual([input]);
});
