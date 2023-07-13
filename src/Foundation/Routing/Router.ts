import { Route } from './Route';
import { RoutesGroup } from './RoutesGroup';
import { RoutesGroupAttributes } from '../../Types/RoutesGroupAttributes';
import { RouterBase } from './RouterBase';
import { join } from 'node:path';

export class Router extends RouterBase {
  /**
   * Loads a file dynamically and returns a Router object.
   * If the file is already loaded, the file won't be loaded again.
   *
   * @see https://v8.dev/features/dynamic-import
   *
   * @param {string} file - The "file" parameter is a string that represents the
   * path or URL of the file that you want to load.
   *
   * @returns the `Router` object.
   *
   */
  public static async loadFile(file: string) {
    await require(file);
    return this;
  }

  /**
   * The `middleware` function adds a middleware callback or callbacks to a route
   * registrar and returns the registrar.
   *
   * @param {Function | Function[]} callback
   *
   * @returns instance of the `RouteRegistrar` class.
   *
   */
  public static middleware(callback: Function | Function[]) {
    const routeRegistrar = new RoutesGroup({ middleware: callback });
    this.addRouteRegistrar(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Creates a new route group.
   *
   */
  public static group(callback: (router: RoutesGroup) => void): RoutesGroup;
  public static group(
    attributes: RoutesGroupAttributes,
    callback: (router: RoutesGroup) => void,
  ): RoutesGroup;
  public static group(
    attributesOrCallback:
      | RoutesGroupAttributes
      | ((router: RoutesGroup) => void),
    callback?: (router: RoutesGroup) => void,
  ): RoutesGroup {
    if (typeof attributesOrCallback === 'function') {
      callback = attributesOrCallback;
      attributesOrCallback = {};
    }

    const routeRegistrar = new RoutesGroup(attributesOrCallback);
    callback(routeRegistrar);
    this.addRouteRegistrar(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Checks if the given HTTP method and URL match the allowed criteria and
   * returns whether the middleware is allowed or not.
   *
   * @param {string} method - The method parameter is a string that represents the
   * HTTP method of a request, such as "GET", "POST", "PUT", etc.
   * @param {string} url - The `url` parameter is a string that represents the URL
   * of the request being made.
   *
   * @returns The method is returning a boolean value.
   *
   */
  public static match(method: string, url: string): false | Route {
    for (const route of Router.routes) {
      const isMatched = route.match(method, url);
      if (!isMatched) continue;

      if (isMatched instanceof Route) return isMatched;
    }

    // There is no matching route
    return false;
  }
}
