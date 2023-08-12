import { makeFunctionsChain } from '@/utils/helpers/makeFunctionsChain';
import { expect, it, vi } from 'vitest';

it('should be able to make a stack of functions', () => {
  const f1 = vi.fn();
  const f2 = vi.fn();
  const f3 = vi.fn();
  const func1 = ({ next }) => {
    f1();
    next();
  };
  const func2 = ({ next }) => {
    f2();
    next();
  };
  const func3 = ({ next }) => {
    f3();
    next();
  };
  const stack = makeFunctionsChain([func1, func2, func3]);
  stack();

  expect(f1).toBeCalledTimes(1);
  expect(f2).toBeCalledTimes(1);
  expect(f3).toBeCalledTimes(1);
});

it('should be able to make a stack of functions with a single function', () => {
  const f1 = vi.fn();
  const func1 = ({ next }) => {
    f1();
    next();
  };

  const stack = makeFunctionsChain([func1]);
  stack();

  expect(f1).toBeCalledTimes(1);
});

it('should be able to make a stack of functions with no functions', () => {
  const stack = makeFunctionsChain([]);
  stack();

  expect(stack).toBeInstanceOf(Function);
});

it('should throw an error if the stack contains a non-function', () => {
  const stack = () => makeFunctionsChain([null]);
  expect(stack).toThrowError();
});
