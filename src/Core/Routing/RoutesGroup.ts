import { Request } from '@/Core/Http/Request';
import { RoutesGroupAttributes } from '@/Types/RoutesGroupAttributes';
import { Arr, Url } from '@/Utils';
import { Route } from './Route';
import { RouterBase } from './RouterBase';

/**
 * The `RoutesGroup` class is a subclass of `RouterBase` that represents a group
 * of routes and provides methods for adding routes, middleware, and nested
 * route groups.
 *
 */
export class RoutesGroup extends RouterBase {
  /**
   * All middleware functions are registered here to be executed when a route
   * is matched by the router.
   *
   * @var Function[]
   *
   */
  protected middlewareLayers: Function[] = [];

  /**
   * This property is used to store the a prefix for names of all nested routes.
   *
   * @var {string}
   *
   */
  private _prefix: string = '';
  protected get prefix(): string {
    return this._prefix;
  }
  protected set prefix(value: string) {
    this._prefix = Url.trim(value);
  }

  /**
   * Here we store all registered routes and  router registrar with their
   * actions and URIs.
   *
   * These router registrars are works like a group of routes and other router
   * registrar together.
   *
   * @var Route[] | RouteRegistrar[]
   *
   */
  public routes: (Route | RoutesGroup)[] = [];

  constructor(attributes?: RoutesGroupAttributes) {
    super();

    this.parseAttributes(attributes);
  }

  /**
   * Parses attributes and assigns values to the middlewareLayers and prefix
   * properties if they exist in the attributes object.
   *
   * @param attributes
   *
   */
  protected parseAttributes(attributes: RoutesGroupAttributes) {
    if (attributes.middleware) {
      this.middlewareLayers.push(...Arr.wrap(attributes.middleware));
    }

    if (attributes.prefix) this.prefix = attributes.prefix;
  }

  /**
   * Add a route to the underlying route collection.
   *
   * @param httpMethods
   * @param uris
   * @param actions
   *
   * @return Route
   *
   */
  protected addRoute(
    httpMethods: string | string[],
    uris: string | string[],
    actions: CallableFunction[] | CallableFunction | null,
  ) {
    const route = super.addRoute(httpMethods, uris, actions);
    if (this.middlewareLayers) route.middleware(this.middlewareLayers);
    if (this.prefix) route.prefix(this.prefix);
    return route;
  }

  /**
   * Adds a route registrar to a list of route registrars.
   *
   * @param {RoutesGroup} routeRegistrar - The parameter `routeRegistrar` is an
   * instance of the `RouteRegistrar` class.
   *
   * @returns The `addRouteGroup` method is returning the `routeRegistrar`
   * object that was passed as a parameter.
   *
   */
  protected addRouteGroup(routeRegistrar: RoutesGroup) {
    this.routes.push(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Adds middleware layers to a route registrar and returns the registrar.
   *
   * @param {Function | Function[]} callback - The `callback`
   * parameter can be of type `Function`, or `Function[]`
   * `.
   * @returns The `middleware` method returns an instance of the `RouteRegistrar`
   * class.
   *
   */
  public middleware(callback: Function | Function[]) {
    const routeRegistrar = new RoutesGroup({ middleware: callback });
    routeRegistrar.middlewareLayers.push(...this.middlewareLayers);
    this.addRouteGroup(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Checks if the given HTTP method and URL match the allowed criteria and
   * returns whether the middleware is allowed or not.
   *
   * @param request - The HTTP request. We will use the url property in this
   * Request.
   *
   * @returns The method is returning a boolean value.
   *
   */
  public match(request: Request): false | Route {
    for (const route of this.routes) {
      const isMatched = route.match(request);
      if (!isMatched) continue;

      if (isMatched instanceof Route) return isMatched;
    }

    // There is no matching route
    return false;
  }

  /**
   * Creates a new route group.
   *
   */
  public group(callback: (router: RoutesGroup) => void): RoutesGroup;
  public group(
    attributes: RoutesGroupAttributes,
    callback: (router: RoutesGroup) => void,
  ): RoutesGroup;
  public group(
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
    routeRegistrar.middlewareLayers = this.middlewareLayers;
    callback(routeRegistrar);
    this.addRouteGroup(routeRegistrar);
    return routeRegistrar;
  }
}
