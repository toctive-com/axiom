import { it, expect, vi } from 'vitest';
import { clustering } from '@/Utils';
import cluster from 'node:cluster';

it('should run the function in cluster', async () => {
  const testFunction = vi.fn();
  await clustering(testFunction, { processes: 1 });

  expect(testFunction).toBeCalledTimes(1);
});

it('should run the function twice in cluster', async () => {
  const testCluster = cluster;
  const testFunction = vi.fn();
  testCluster.fork = testFunction;
  await clustering(testFunction, { processes: 2, cluster: testCluster });

  expect(testFunction).toBeCalledTimes(2);
});

it('should respawn forks on exit', async () => {
  const testCluster = cluster;
  const processes = 4;
  const testFunction = vi.fn();
  testCluster.fork = testFunction;

  const testOnFunction = vi.fn();
  testCluster.on = testOnFunction;

  await clustering(testFunction, { processes, cluster: testCluster });

  expect(testFunction).toBeCalledTimes(processes);
  expect(testOnFunction).toBeCalledTimes(1);
});

it('should sleep for 100ms before respawning', async () => {
  const testCluster = cluster;
  const processes = 4;
  const testFunction = vi.fn();
  testCluster.fork = testFunction;

  const testOnFunction = vi.fn();
  testCluster.on = testOnFunction;

  const startTime = Date.now();
  await clustering(testFunction, {
    processes,
    cluster: testCluster,
    restartDelay: 100,
  });
  const endTime = Date.now();

  expect(testFunction).toBeCalledTimes(processes);
  expect(testOnFunction).toBeCalledTimes(1);
  expect(endTime - startTime).toBeGreaterThanOrEqual(100);
});
