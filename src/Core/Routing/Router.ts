import { Request } from '@/Core/Http/Request';
import { RoutesGroupAttributes } from '@/Types/RoutesGroupAttributes';
import { RoutesGroupCallback } from '@/Types/RoutesGroupCallback';
import { Route } from './Route';
import { RouterBase } from './RouterBase';
import { RoutesGroup } from './RoutesGroup';

export class Router extends RouterBase {
  /**
   * Loads a file dynamically and returns a Router object.
   * If the file is already loaded, the file won't be loaded again.
   *
   * @param {string} file - The "file" parameter is a string that represents the
   * path or URL of the file that you want to load.
   *
   * @returns the `Router` object.
   *
   */
  public async loadFile(file: string) {
    await require(file);
    return this;
  }

  /**
   * The `middleware` function adds a middleware callback or callbacks to a route
   * registrar and returns the registrar.
   *
   * @param {Function | Function[]} callback
   *
   * @returns instance of the `RoutesGroup` class.
   *
   */
  public middleware(callback: Function | Function[]) {
    const routesGroup = new RoutesGroup({ middleware: callback });
    this.addRoutesGroup(routesGroup);
    return routesGroup;
  }

  /**
   * Creates a new route group.
   *
   */
  public group(callback: RoutesGroupCallback): RoutesGroup;
  public group(
    attributes: RoutesGroupAttributes,
    callback: RoutesGroupCallback,
  ): RoutesGroup;
  public group(
    attributesOrCallback: RoutesGroupAttributes | RoutesGroupCallback,
    callback?: RoutesGroupCallback,
  ): RoutesGroup {
    if (typeof attributesOrCallback === 'function') {
      callback = attributesOrCallback;
      attributesOrCallback = {};
    }

    const routesGroup = new RoutesGroup(attributesOrCallback);
    callback(routesGroup);
    this.addRoutesGroup(routesGroup);
    return routesGroup;
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
  public match(request: Request): false | Route {
    for (const route of this.routes) {
      const isMatched = route.match(request);
      if (!isMatched) continue;

      return isMatched;
    }

    // There is no matching route
    return false;
  }
}
