import { it, expect } from 'vitest';
import { sleep } from '@/utils';

it('should sleep for 100ms', async () => {
  const startTime = Date.now();
  await sleep(100);
  const endTime = Date.now();
  expect(endTime - startTime).toBeGreaterThanOrEqual(100);
});

it('should sleep for 200ms', async () => {
  const startTime = Date.now();
  await sleep(200);
  const endTime = Date.now();
  expect(endTime - startTime).toBeGreaterThanOrEqual(200);
});
