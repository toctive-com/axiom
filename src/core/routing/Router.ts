import { Request } from '@/core/http/Request';
import { RoutesGroupAttributes } from '@/types/RoutesGroupAttributes';
import { RoutesGroupCallback } from '@/types/RoutesGroupCallback';
import { makeFunctionsChain } from '@/utils';
import { Response } from '../http/Response';
import { Route } from './Route';
import { RouterBase } from './RouterBase';
import { RoutesGroup } from './RoutesGroup';

export class Router extends RouterBase {
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
   * Adds a prefix to a route and returns a routes group.
   *
   * @param {string} prefix
   *
   * @returns instance of the `RoutesGroup` class.
   *
   */
  public prefix(prefix: string) {
    const routesGroup = new RoutesGroup({ prefix });
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
   * Checks if a given request matches any of the routes and returns an array of
   * matched routes or false if there is no matching route.
   *
   * @param {Request} request - object that represents the incoming request. It
   * typically contains information such as the HTTP method (e.g., GET, POST), the
   * URL path, query parameters, and headers.
   *
   * @returns either an array of matched routes or false.
   *
   */
  public match(request: Request, response: Response): false | Route[] {
    const matchedRoutes = [];
    for (const route of this.routes) {
      const isMatched = route.match(request, response);
      if (!isMatched) continue;

      matchedRoutes.push(isMatched);
    }

    // There is no matching route
    return matchedRoutes.length ? matchedRoutes : false;
  }

  /**
   * Adds a new router as a sub-router. This is done by creating a RoutesGroup
   * of the sub-router.
   *
   * @param {Router} router
   *
   * @returns {RoutesGroup} instance of RoutesGroup class
   *
   */
  public use(router: Router): RoutesGroup {
    const routesGroup = new RoutesGroup();
    routesGroup.routes = router.routes;
    return this.addRoutesGroup(routesGroup);
  }

  /**
   * Handles the routing logic by matching the request to a route, executing the
   * corresponding actions, and calling the next function in the middleware
   * chain if no route is matched.
   *
   * @param {Request} req - Object representing the HTTP request received by the
   * server. It contains information such as the request method, URL, headers,
   * and body.
   * @param {Response} res - Object representing the HTTP response that will be
   * sent back to the client. It contains methods and properties that allow you
   * to manipulate the response, set headers, and send data back to the client.
   * @param {Function} [next] - Function that represents the next middleware
   * function in the request-response cycle. It is optional and can be used to
   * pass control to the next middleware function. If provided, the `dispatch`
   * function will call this `next` function if there is no matched route.
   *
   * @returns a Promise that resolves to an unknown value.
   */
  public async dispatch(
    req: Request,
    res: Response,
    next?: Function,
  ): Promise<unknown> {
    try {
      const matchedRoutes = this.match(req, res);
      if (!matchedRoutes) {
        // If there is no matched route call the next function
        if (next) return await next();
        return null;
      }

      const nextFunctions = matchedRoutes
        .slice(1)
        .map((r) => r.actions)
        .flat();
      if (next) nextFunctions.push(next);

      const nextFunctionsStack = makeFunctionsChain(nextFunctions, {
        req,
        res,
      });

      return await matchedRoutes[0].dispatch(req, res, nextFunctionsStack);
    } catch (error) {
      res.setStatus("INTERNAL_SERVER_ERROR")

      return {
        success: false,
        message: error.message,
        stack: error.stack?.split('\n'),
      };
    }
  }
}
