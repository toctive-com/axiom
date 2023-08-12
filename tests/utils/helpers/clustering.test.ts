import { clustering } from '@/utils';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { expect, it, vi } from 'vitest';

it('should run the function in cluster', async () => {
  const testFunction = vi.fn();
  await clustering(testFunction, { processes: 1 });

  expect(testFunction).toBeCalledTimes(1);
});

it('should work without any options', async () => {
  const originalCluster = cluster;
  const testCluster = cluster;
  (testCluster as any).isPrimary = true;

  const testForkFunction = vi.fn();
  (testCluster as any).fork = testForkFunction;
  const testOnFunction = vi.fn();
  (testCluster as any).fork = testOnFunction;

  // Mock cluster functionality to avoid errors
  (cluster as any) = cluster;

  // Mock process.exit to capture the provided exit code
  // and set a flag indicating it was called
  const exitTestFunction = vi.fn();
  (global as any).process.exit = exitTestFunction;

  const testFunction = vi.fn();
  await clustering(testFunction);

  expect(testOnFunction).toBeCalledTimes(availableParallelism());

  // Restore original cluster functionality
  (cluster as any) = originalCluster;
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

it('should sleep for 100ms before respawn', async () => {
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

it('process.exit(0) should be called', async () => {
  const testCluster = cluster;
  (testCluster as any).isPrimary = false;

  // Mock process.exit to capture the provided exit code
  // and set a flag indicating it was called
  const exitTestFunction = vi.fn();
  (global as any).process.exit = exitTestFunction;

  const testFunction = vi.fn();
  await clustering(testFunction, { processes: 1, cluster: testCluster });

  expect(testFunction).toBeCalledTimes(1);
  expect(exitTestFunction).toBeCalledTimes(1);
});

it('should spawn a new cluster if the primary process dies', async () => {
  const testCluster = cluster;
  (testCluster as any).isPrimary = true;

  const testForkFunction = vi.fn();
  testCluster.fork = testForkFunction;

  const testOnFunction = vi.fn();
  (testCluster as any).on = (name: string, callback: Function) => {
    testOnFunction();
    callback();
  };

  const processes = 4;
  const testFunction = vi.fn();
  await clustering(testFunction, {
    processes,
    cluster: testCluster,
    respawnAgain: true,
  });

  expect(testFunction).not.toBeCalled();
  expect(testForkFunction).toBeCalledTimes(processes);
  expect(testOnFunction).toBeCalledTimes(1);
});
