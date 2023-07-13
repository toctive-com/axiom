/**
 * The sleep function is an asynchronous function that pauses the execution for a
 * specified number of milliseconds.
 *
 * @param {number} ms - The `ms` parameter is the number of milliseconds to wait
 * before resolving the promise.
 *
 * @returns The `sleep` function returns a Promise.
 *
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
