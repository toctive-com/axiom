import { METHODS } from "node:http";
import { Route } from "./Route";

export class Router {
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
   * All HTTP verbs that supported by node.js HTTP server
   *
   * @see https://nodejs.org/api/http.html#httpmethods
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   * @var string[]
   *
   */
  public static readonly httpVerbs: string[] =
    METHODS || Router.defaultSupportedHttpVerbs;

  /**
   * Here we store all registered route with its actions and URIs
   *
   * @var Route[]
   *
   */
  static routes: Route[] = [];

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
  public static addRoute(
    httpVerb: string | string[],
    uri: string | string[],
    action: CallableFunction[] | CallableFunction | null
  ) {
    if (typeof httpVerb === "string") httpVerb = [httpVerb];
    if (typeof uri === "string") uri = [uri];
    if (typeof action === "function") action = [action];

    const route = new Route(httpVerb, uri, action);
    Router.routes.push(route);
    return route;
  }

  /**
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
    return Router.any(uri, action);
  }

  /**
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
    return Router.addRoute(Router.httpVerbs, uri, action);
  }

  /**
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
    return Router.addRoute("acl", uri, action);
  }

  /**
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
    return Router.addRoute("bind", uri, action);
  }

  /**
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
    return Router.addRoute("checkout", uri, action);
  }

  /**
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
    return Router.addRoute("connect", uri, action);
  }

  /**
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
    return Router.addRoute("copy", uri, action);
  }

  /**
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
    return Router.addRoute("delete", uri, action);
  }

  /**
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
    return Router.addRoute("get", uri, action);
  }

  /**
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
    return Router.addRoute("head", uri, action);
  }

  /**
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
    return Router.addRoute("link", uri, action);
  }

  /**
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
    return Router.addRoute("lock", uri, action);
  }

  /**
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
    return Router.addRoute("merge", uri, action);
  }

  /**
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
    return Router.addRoute("mkactivity", uri, action);
  }

  /**
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
    return Router.addRoute("mkcalendar", uri, action);
  }

  /**
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
    return Router.addRoute("mkcol", uri, action);
  }

  /**
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
    return Router.addRoute("move", uri, action);
  }

  /**
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
    return Router.addRoute("notify", uri, action);
  }

  /**
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
    return Router.addRoute("options", uri, action);
  }

  /**
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
    return Router.addRoute("patch", uri, action);
  }

  /**
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
    return Router.addRoute("post", uri, action);
  }

  /**
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
    return Router.addRoute("propfind", uri, action);
  }

  /**
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
    return Router.addRoute("proppatch", uri, action);
  }

  /**
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
    return Router.addRoute("purge", uri, action);
  }

  /**
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
    return Router.addRoute("put", uri, action);
  }

  /**
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
    return Router.addRoute("rebind", uri, action);
  }

  /**
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
    return Router.addRoute("report", uri, action);
  }

  /**
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
    return Router.addRoute("search", uri, action);
  }

  /**
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
    return Router.addRoute("source", uri, action);
  }

  /**
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
    return Router.addRoute("subscribe", uri, action);
  }

  /**
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
    return Router.addRoute("trace", uri, action);
  }

  /**
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
    return Router.addRoute("unbind", uri, action);
  }

  /**
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
    return Router.addRoute("unlink", uri, action);
  }

  /**
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
    return Router.addRoute("unlock", uri, action);
  }

  /**
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
    return Router.addRoute("unsubscribe", uri, action);
  }
}
