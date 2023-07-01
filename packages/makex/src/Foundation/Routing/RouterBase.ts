import { METHODS } from "node:http";
import { Route } from "./Route";
import { RouteRegistrar } from "./RouteRegistrar";

export abstract class RouterBase {
  /**
   * There are all supported HTTP verbs in node.js v18
   * We use these verbs as a fallback if http.METHODS are removed in the future
   *
   * @var string[]
   *
   */
  public static readonly defaultSupportedHttpVerbs = [
    "acl",
    "bind",
    "checkout",
    "connect",
    "copy",
    "delete",
    "get",
    "head",
    "link",
    "lock",
    "m-search",
    "merge",
    "mkactivity",
    "mkcalendar",
    "mkcol",
    "move",
    "notify",
    "options",
    "patch",
    "post",
    "propfind",
    "proppatch",
    "purge",
    "put",
    "rebind",
    "report",
    "search",
    "source",
    "subscribe",
    "trace",
    "unbind",
    "unlink",
    "unlock",
    "unsubscribe",
  ];

  /**
   * All HTTP verbs that are supported by the node.js HTTP server
   *
   * @see https://nodejs.org/api/http.html#httpmethods
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   * @var string[]
   *
   */
  public static readonly httpVerbs: string[] =
    METHODS || RouterBase.defaultSupportedHttpVerbs;

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
  protected static routes: (Route | RouteRegistrar)[] = [];

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
  protected static addRoute(
    httpVerb: string | string[],
    uri: string | string[],
    action: CallableFunction[] | CallableFunction | null
  ) {
    // TODO create an array facade with wrap method and wrap these params
    if (typeof httpVerb === "string") httpVerb = [httpVerb];
    if (typeof uri === "string") uri = [uri];
    if (typeof action === "function") action = [action];

    const route = new Route(httpVerb, uri, action);
    RouterBase.routes.push(route);
    return route;
  }

  /**
   * Adds a route registrar to a list of route registrars.
   *
   * @param {RouteRegistrar} routeRegistrar - The parameter `routeRegistrar` is an
   * instance of the `RouteRegistrar` class.
   *
   * @returns The `addRouteRegistrar` method is returning the `routeRegistrar`
   * object that was passed as a parameter.
   *
   */
  protected static addRouteRegistrar(routeRegistrar: RouteRegistrar) {
    RouterBase.routes.push(routeRegistrar);
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
  public static all(
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
  public static any(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute(this.httpVerbs, uri, action);
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
  public static acl(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("acl", uri, action);
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
  public static bind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("bind", uri, action);
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
  public static checkout(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("checkout", uri, action);
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
  public static connect(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("connect", uri, action);
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
  public static copy(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("copy", uri, action);
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
  public static delete(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("delete", uri, action);
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
  public static get(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("get", uri, action);
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
  public static head(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("head", uri, action);
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
  public static link(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("link", uri, action);
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
  public static lock(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("lock", uri, action);
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
  public static merge(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("merge", uri, action);
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
  public static mkactivity(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("mkactivity", uri, action);
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
  public static mkcalendar(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("mkcalendar", uri, action);
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
  public static mkcol(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("mkcol", uri, action);
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
  public static move(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("move", uri, action);
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
  public static notify(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("notify", uri, action);
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
  public static options(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("options", uri, action);
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
  public static patch(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("patch", uri, action);
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
  public static post(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("post", uri, action);
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
  public static propfind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("propfind", uri, action);
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
  public static proppatch(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("proppatch", uri, action);
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
  public static purge(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("purge", uri, action);
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
  public static put(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("put", uri, action);
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
  public static rebind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("rebind", uri, action);
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
  public static report(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("report", uri, action);
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
  public static search(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("search", uri, action);
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
  public static source(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("source", uri, action);
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
  public static subscribe(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("subscribe", uri, action);
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
  public static trace(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("trace", uri, action);
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
  public static unbind(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("unbind", uri, action);
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
  public static unlink(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("unlink", uri, action);
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
  public static unlock(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("unlock", uri, action);
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
  public static unsubscribe(
    uri: string | string[],
    action: CallableFunction | CallableFunction[]
  ) {
    return RouterBase.addRoute("unsubscribe", uri, action);
  }
}
