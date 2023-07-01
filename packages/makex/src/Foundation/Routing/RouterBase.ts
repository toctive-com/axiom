import { METHODS } from "node:http";
import { Route } from "./Route";

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
   * All HTTP verbs that supported by node.js HTTP server
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
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]|null} action
   *
   * @return Route
   *
   */
  protected static addRoute(
    httpVerb: string | string[],
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction[] | CallableFunction | null
  ) {
    if (typeof httpVerb === "string") httpVerb = [httpVerb];
    if (typeof uri === "string") uri = [uri];
    if (uri instanceof RegExp) uri = [uri];
    if (typeof action === "function") action = [action];

    const route = new Route(httpVerb, uri, action);
    RouterBase.routes.push(route);
    return route;
  }

  /**
   * Loads a file dynamically and returns a Router object.
   * If the file is already loaded, the file won't loaded again.
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
   * Create a new route with all HTTP verbs and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static all(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.any(uri, action);
  }

  /**
   * Create a new route with all HTTP verbs and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static any(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute(this.httpVerbs, uri, action);
  }

  /**
   * Create a new Acl route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static acl(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("acl", uri, action);
  }

  /**
   * Create a new Bind route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static bind(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("bind", uri, action);
  }

  /**
   * Create a new Checkout route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static checkout(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("checkout", uri, action);
  }

  /**
   * Create a new Connect route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static connect(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("connect", uri, action);
  }

  /**
   * Create a new Copy route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static copy(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("copy", uri, action);
  }

  /**
   * Create a new Delete route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static delete(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("delete", uri, action);
  }

  /**
   * Create a new Get route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static get(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("get", uri, action);
  }

  /**
   * Create a new Head route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static head(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("head", uri, action);
  }

  /**
   * Create a new Link route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static link(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("link", uri, action);
  }

  /**
   * Create a new Lock route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static lock(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("lock", uri, action);
  }

  /**
   * Create a new Merge route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static merge(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("merge", uri, action);
  }

  /**
   * Create a new Mkactivity route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static mkactivity(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkactivity", uri, action);
  }

  /**
   * Create a new Mkcalendar route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static mkcalendar(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkcalendar", uri, action);
  }

  /**
   * Create a new Mkcol route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static mkcol(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("mkcol", uri, action);
  }

  /**
   * Create a new Move route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static move(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("move", uri, action);
  }

  /**
   * Create a new Notify route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static notify(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("notify", uri, action);
  }

  /**
   * Create a new Options route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static options(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("options", uri, action);
  }

  /**
   * Create a new Patch route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static patch(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("patch", uri, action);
  }

  /**
   * Create a new Post route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static post(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("post", uri, action);
  }

  /**
   * Create a new Propfind route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static propfind(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("propfind", uri, action);
  }

  /**
   * Create a new Proppatch route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static proppatch(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("proppatch", uri, action);
  }

  /**
   * Create a new Purge route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static purge(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("purge", uri, action);
  }

  /**
   * Create a new Put route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static put(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("put", uri, action);
  }

  /**
   * Create a new Rebind route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static rebind(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("rebind", uri, action);
  }

  /**
   * Create a new Report route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static report(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("report", uri, action);
  }

  /**
   * Create a new Search route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static search(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("search", uri, action);
  }

  /**
   * Create a new Source route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static source(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("source", uri, action);
  }

  /**
   * Create a new Subscribe route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static subscribe(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("subscribe", uri, action);
  }

  /**
   * Create a new Trace route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static trace(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("trace", uri, action);
  }

  /**
   * Create a new Unbind route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static unbind(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unbind", uri, action);
  }

  /**
   * Create a new Unlink route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static unlink(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unlink", uri, action);
  }

  /**
   * Create a new Unlock route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static unlock(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unlock", uri, action);
  }

  /**
   * Create a new Unsubscribe route and store it in Router routes
   *
   * @param {string|string[]|RegExp|RegExp[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public static unsubscribe(
    uri: string | string[] | RegExp | RegExp[],
    action: CallableFunction | CallableFunction[]
  ) {
    return this.addRoute("unsubscribe", uri, action);
  }
}
