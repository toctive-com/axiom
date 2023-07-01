import { RouteRegistrar } from "./RouteRegistrar";
import { RouterBase } from "./RouterBase";

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
    await import(file);
    return this;
  }

  /**
   * The `middleware` function adds a middleware callback or callbacks to a route
   * registrar and returns the registrar.
   * 
   * @param {Function | Function[] | string | string[]} callback
   * 
   * @returns instance of the `RouteRegistrar` class.
   * 
   */
  public static middleware(
    callback: Function | Function[] | string | string[]
  ) {
    const routeRegistrar = new RouteRegistrar({ middleware: callback });
    this.addRouteRegistrar(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Creates a new route group.
   *
   */
  // TODO add type for attributes
  public static group(
    callback: (router: RouteRegistrar) => void
  ): RouteRegistrar;
  public static group(
    attributes: any,
    callback: (router: RouteRegistrar) => void
  ): RouteRegistrar;
  public static group(
    attributesOrCallback: any,
    callback?: (router: RouteRegistrar) => void
  ): RouteRegistrar {
    if (typeof attributesOrCallback === "function") {
      callback = attributesOrCallback;
      attributesOrCallback = {};
    }

    const routeRegistrar = new RouteRegistrar(attributesOrCallback);
    callback(routeRegistrar);
    this.addRouteRegistrar(routeRegistrar);
    return routeRegistrar;
  }
}
