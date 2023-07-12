import { it, expect, vi } from 'vitest';
import { clustering } from '../../../src';

it('should run the function in cluster', async () => {
  const testFunction = vi.fn().mockImplementation(async () => true);
  const result = await clustering(testFunction, { processes: 1 });

  expect(testFunction).toBeCalledTimes(1);
});
