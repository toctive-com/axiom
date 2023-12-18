import semver from 'semver';
import { RouteActionParameters } from '@/types/RouteAction';

/**
 * Middleware to handle multiple API versions using SemVer. The versions object
 * should be in the format { '1.0.0': handler, '2.0.0': handler, ... }
 *
 * @example
 * ```
 * router.get(
 *    '/test-middleware',
 *    versionsMiddleware({
 *        v1: FrontPagesController.indexV1,
 *        v0: FrontPagesController.index,
 *    }),
 * );
 * ```
 *
 * @param {Record<string, Function>} versionsAndFunctions - Object mapping
 * version strings to handler functions.
 * @param {string} [defaultVersion='1.0.0'] - Default API version.
 * @param {string} [headerName='x-version'] - Header name containing the API
 * version.
 * @returns {Function} Middleware function.
 */
export const versionsMiddleware = function (
  versionsAndFunctions: Record<string, Function>,
  defaultVersion = '*',
  headerName = 'x-version',
) {
  return function (routeActionParameters: RouteActionParameters) {
    // Get version header and set the default value
    let versionHeader =
      routeActionParameters.req.headers[headerName] ?? defaultVersion;

    // If there are multiple headers, use the first one
    if (Array.isArray(versionHeader)) versionHeader = versionHeader[0];

    // Coerce the version header to a SemVer object
    versionHeader = semver.coerce(versionHeader)?.toString() || defaultVersion;

    // Create an object mapping formatted versions to their original versions
    const versionsObject: Record<string, string> = Object.fromEntries(
      Object.keys(versionsAndFunctions).map((version) => [
        semver.coerce(version)?.format(),
        version,
      ]),
    );

    // Find the highest available version compatible with the requested version
    // header
    const compatibleVersion = semver.maxSatisfying(
      Object.keys(versionsObject),
      versionHeader,
    );

    // If a compatible version is found, call the corresponding handler function
    if (compatibleVersion !== null) {
      return versionsAndFunctions[versionsObject[compatibleVersion]](
        routeActionParameters,
      );
    }

    // If no compatible version is found, forward the request to the next route
    return routeActionParameters.next();
  };
};

export default versionsMiddleware;
