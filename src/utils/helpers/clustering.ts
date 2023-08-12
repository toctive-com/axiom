import cluster, { Cluster } from 'node:cluster';
import { availableParallelism } from 'node:os';
import { sleep } from './sleep';

/**
 * Allows for running a callback function in parallel across multiple processes
 * using Node.js cluster module.
 *
 * @param {Function} callback - Function that will be executed in each worker
 * process. It can be any function that you want to run in parallel.
 *
 * @param [options] - The `options` parameter is an optional object that can
 * contain the following properties:
 * - processes: The number of processes to spawn. Defaults to the number of CPUs
 * - restartDelay: The number of milliseconds to wait before restarting a worker
 * - respawnAgain: Whether to respawn the cluster module if a worker process
 *   dies.
 * - cluster: The cluster module to use. Defaults to the cluster module.
 *
 */
export async function clustering(
  callback: Function,
  options?: {
    processes?: number;
    restartDelay?: number;
    respawnAgain?: boolean;
    cluster?: Cluster;
  },
): Promise<void> {
  // if the user doesn't pass in a cluster module, use the default one
  options = options ?? {};
  options.cluster = options.cluster ?? cluster;
  options.respawnAgain = options.respawnAgain ?? true;

  const numCpus = options?.processes ?? availableParallelism();
  if (options?.cluster?.isPrimary) {
    // if there's only one CPU, just run the callback function and exit.
    // This is to prevent the cluster module from spawning another process.
    // This is useful for debugging purposes.
    // If you want to run the callback function in parallel across multiple
    // processes, then use the `processes` option.
    // For example, if you want to run the callback function in parallel across
    // 4 processes, then use the following:
    //
    // clustering(callback, { processes: 4 }
    //
    if (numCpus === 1) {
      await callback();
      return;
    }

    // spawn the cluster module with the number of CPUs specified in the options
    for (let i = 0; i < numCpus; i++) {
      await sleep(options?.restartDelay ?? 0);
      options.cluster.fork();
    }

    // restart the cluster module if a worker process dies
    if (options?.respawnAgain) {
      options?.cluster.on('exit', async (_worker, _code, _signal) => {
        await sleep(options?.restartDelay ?? 0);
        options?.cluster.fork();
      });
    }
  } else {
    await callback();
    process.exit(0);
  }
}
