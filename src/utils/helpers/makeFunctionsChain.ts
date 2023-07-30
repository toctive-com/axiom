import { Arr } from '../facades';

/**
 * Creates a stack of functions that can be executed in sequence.
 *
 * @param next - A function or an array of functions that will be stacked.
 * @param rest - The rest represents additional properties or data that can be
 * passed along to the functions in the stack. It is an object with key-value
 * pairs, where the keys are strings and the values can be of any type.
 *
 * @returns Returns a function that can be executed to start the execution of
 * the stack of functions.
 *
 */
export const makeFunctionsChain = (
  next: Function | Function[],
  rest?: { [key: string]: any },
) => {
  if (next.length === 0) return () => undefined;
  next = Arr.wrap(next);

  const currentFunc = next.shift();
  return () =>
    currentFunc({
      next: makeFunctionsChain(next, rest),
      ...rest,
    });
};
