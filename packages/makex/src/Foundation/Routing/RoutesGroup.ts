import { Route } from "./Route";
import { RouterBase } from "./RouterBase";

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
   * @var {string | null}
   *
   */
  protected prefix: string | null = null;

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
  protected routes: (Route | RoutesGroup)[] = [];

  constructor(attributes?: any) {
    super();

    this.parseAttributes(attributes);
  }

  /**
   * Parses attributes and assigns values to the middlewareLayers and
   * prefix properties if they exist in the attributes object.
   *
   * @param {any} attributes
   *
   */
  protected parseAttributes(attributes: any) {
    if (attributes) {
      if (attributes.middleware) {
        this.middlewareLayers = attributes.middleware;
      }

      if (attributes.prefix) {
        this.prefix = attributes.prefix;
      }
    }
  }

  /**
   * Add a route to the underlying route collection.
   *
   * @param {string|string[]} httpVerb
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]|null} action
   *
   * @return Route
   *
   */
  protected addRoute(
    httpVerb: string | string[],
    uri: string | string[],
    action: CallableFunction[] | CallableFunction | null
  ) {
    // TODO create an array facade with wrap method and wrap these params
    if (typeof httpVerb === "string") httpVerb = [httpVerb];
    if (typeof uri === "string") uri = [uri];
    if (typeof action === "function") action = [action];

    // TODO add name property to groups => Router.group().named("g1")
    const route = new Route(httpVerb, uri, action);
    if (this.middlewareLayers) route.middleware(this.middlewareLayers);
    if (this.prefix) route.prefix(this.prefix);

    this.routes.push(route);
    return route;
  }

  /**
   * Adds a route registrar to a list of route registrars.
   *
   * @param {RoutesGroup} routeRegistrar - The parameter `routeRegistrar` is an
   * instance of the `RouteRegistrar` class.
   *
   * @returns The `addRouteRegistrar` method is returning the `routeRegistrar`
   * object that was passed as a parameter.
   *
   */
  protected addRouteRegistrar(routeRegistrar: RoutesGroup) {
    this.routes.push(routeRegistrar);
    return routeRegistrar;
  }

/**
 * Adds middleware layers to a route registrar and returns the registrar.
 * 
 * @param {Function | Function[] | string | string[]} callback - The `callback`
 * parameter can be of type `Function`, `Function[]`, `string`, or `string[]
 * `.
 * @returns The `middleware` method returns an instance of the `RouteRegistrar`
 * class.
 * 
 */
  public middleware(callback: Function | Function[] | string | string[]) {
    const routeRegistrar = new RoutesGroup({ middleware: callback });
    routeRegistrar.middlewareLayers.push(...this.middlewareLayers);
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
  public match(method: string, url: string): false | Route {
    for (const route of this.routes) {
      const isMatched = route.match(method, url);
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
  // TODO add type for attributes
  public group(callback: (router: RoutesGroup) => void): RoutesGroup;
  public group(
    attributes: any,
    callback: (router: RoutesGroup) => void
  ): RoutesGroup;
  public group(
    attributesOrCallback: any,
    callback?: (router: RoutesGroup) => void
  ): RoutesGroup {
    if (typeof attributesOrCallback === "function") {
      callback = attributesOrCallback;
      attributesOrCallback = {};
    }

    const routeRegistrar = new RoutesGroup(attributesOrCallback);
    routeRegistrar.middlewareLayers = this.middlewareLayers;
    callback(routeRegistrar);
    this.addRouteRegistrar(routeRegistrar);
    return routeRegistrar;
  }

  /**
   * Create a new route with all HTTP verbs and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public all(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.any(uri, action);
  }

  /**
   * Create a new route with all HTTP verbs and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public any(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute(RoutesGroup.httpVerbs, uri, action);
  }

  /**
   * Create a new Acl route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public acl(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("acl", uri, action);
  }

  /**
   * Create a new Bind route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public bind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("bind", uri, action);
  }

  /**
   * Create a new Checkout route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public checkout(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("checkout", uri, action);
  }

  /**
   * Create a new Connect route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public connect(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("connect", uri, action);
  }

  /**
   * Create a new Copy route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public copy(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("copy", uri, action);
  }

  /**
   * Create a new Delete route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public delete(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("delete", uri, action);
  }

  /**
   * Create a new Get route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public get(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("get", uri, action);
  }

  /**
   * Create a new Head route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public head(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("head", uri, action);
  }

  /**
   * Create a new Link route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public link(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("link", uri, action);
  }

  /**
   * Create a new Lock route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public lock(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("lock", uri, action);
  }

  /**
   * Create a new Merge route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public merge(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("merge", uri, action);
  }

  /**
   * Create a new Mkactivity route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public mkactivity(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkactivity", uri, action);
  }

  /**
   * Create a new Mkcalendar route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public mkcalendar(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkcalendar", uri, action);
  }

  /**
   * Create a new Mkcol route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public mkcol(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkcol", uri, action);
  }

  /**
   * Create a new Move route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public move(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("move", uri, action);
  }

  /**
   * Create a new Notify route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public notify(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("notify", uri, action);
  }

  /**
   * Create a new Options route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public options(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("options", uri, action);
  }

  /**
   * Create a new Patch route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public patch(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("patch", uri, action);
  }

  /**
   * Create a new Post route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public post(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("post", uri, action);
  }

  /**
   * Create a new Propfind route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public propfind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("propfind", uri, action);
  }

  /**
   * Create a new Proppatch route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public proppatch(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("proppatch", uri, action);
  }

  /**
   * Create a new Purge route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public purge(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("purge", uri, action);
  }

  /**
   * Create a new Put route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public put(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("put", uri, action);
  }

  /**
   * Create a new Rebind route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public rebind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("rebind", uri, action);
  }

  /**
   * Create a new Report route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public report(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("report", uri, action);
  }

  /**
   * Create a new Search route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public search(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("search", uri, action);
  }

  /**
   * Create a new Source route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public source(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("source", uri, action);
  }

  /**
   * Create a new Subscribe route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public subscribe(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("subscribe", uri, action);
  }

  /**
   * Create a new Trace route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public trace(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("trace", uri, action);
  }

  /**
   * Create a new Unbind route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public unbind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unbind", uri, action);
  }

  /**
   * Create a new Unlink route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public unlink(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unlink", uri, action);
  }

  /**
   * Create a new Unlock route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public unlock(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unlock", uri, action);
  }

  /**
   * Create a new Unsubscribe route and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public unsubscribe(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unsubscribe", uri, action);
  }
}
