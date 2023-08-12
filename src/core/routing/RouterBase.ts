import { HttpMethod } from '@/types';
import { Arr, Url } from '@/utils';
import { Route } from './Route';
import { RoutesGroup } from './RoutesGroup';

export abstract class RouterBase {
  /**
   * All HTTP verbs that are supported by the node.js HTTP server
   *
   * @see https://nodejs.org/api/http.html#httpmethods
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   * @var string[]
   *
   */
  public static readonly httpMethods: HttpMethod[] = [
    'ACL',
    'BIND',
    'CHECKOUT',
    'CONNECT',
    'COPY',
    'DELETE',
    'GET',
    'HEAD',
    'LINK',
    'LOCK',
    'M-SEARCH',
    'MERGE',
    'MKACTIVITY',
    'MKCALENDAR',
    'MKCOL',
    'MOVE',
    'NOTIFY',
    'OPTIONS',
    'PATCH',
    'POST',
    'PROPFIND',
    'PROPPATCH',
    'PURGE',
    'PUT',
    'REBIND',
    'REPORT',
    'SEARCH',
    'SOURCE',
    'SUBSCRIBE',
    'TRACE',
    'UNBIND',
    'UNLINK',
    'UNLOCK',
    'UNSUBSCRIBE',
  ];

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
  routes: (Route | RoutesGroup)[] = [];

  /**
   * Add a route to the underlying route collection.
   *
   * @param httpMethods - one or more of HTTP methods supported by Node.js
   * @param uris - one or more of string routes. May includes route variables.
   * @param actions - functions that will be executed when route match the
   * request.
   *
   * @return Route instance
   *
   */
  protected addRoute(
    httpMethods: HttpMethod | HttpMethod[],
    uris: string | string[],
    actions: CallableFunction[] | CallableFunction,
  ) {
    httpMethods = Arr.wrap(httpMethods);
    uris = Arr.wrap(uris).map((uri) => Url.trim(uri));
    actions = Arr.wrap(actions);

    // remove leading and trailing slashes
    uris = uris.map(Url.trim);

    const route = new Route(httpMethods, uris, actions);
    this.routes.push(route);
    return route;
  }

  /**
   * Adds a route group to a list of route groups.
   *
   * @param {RoutesGroup} routesGroup - The parameter `routesGroup` is an
   * instance of the `RoutesGroup` class.
   *
   * @returns The `addRoutesGroup` method is returning the `routesGroup` object
   * that was passed as a parameter.
   *
   */
  protected addRoutesGroup(routesGroup: RoutesGroup) {
    this.routes.push(routesGroup);
    return routesGroup;
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
    action: CallableFunction | CallableFunction[],
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute(RouterBase.httpMethods, uri, action);
  }

  /**
   * Create a new route with one or more HTTP verbs and store it in Router
   * routes
   *
   * @param httpMethods
   * @param uri
   * @param action
   *
   * @returns Route
   *
   */
  public anyOf(
    httpMethods: HttpMethod | HttpMethod[],
    uri: string | string[],
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute(httpMethods, uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('ACL', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('BIND', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('CHECKOUT', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('CONNECT', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('COPY', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('DELETE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute(['GET', 'HEAD'], uri, action);
  }

  /**
   * Create a new Get route without HEAD HTTP method and store it in Router routes
   *
   * @param {string|string[]} uri
   * @param {CallableFunction|CallableFunction[]} action
   *
   * @returns Route
   *
   */
  public getOnly(
    uri: string | string[],
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('GET', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('HEAD', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('LINK', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('LOCK', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('MERGE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('MKACTIVITY', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('MKCALENDAR', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('MKCOL', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('MOVE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('NOTIFY', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('OPTIONS', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('PATCH', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('POST', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('PROPFIND', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('PROPPATCH', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('PURGE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('PUT', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('REBIND', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('REPORT', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('M-SEARCH', uri, action);
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
  public mSearch(
    uri: string | string[],
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('M-SEARCH', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('SOURCE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('SUBSCRIBE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('TRACE', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('UNBIND', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('UNLINK', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('UNLOCK', uri, action);
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
    action: CallableFunction | CallableFunction[],
  ) {
    return this.addRoute('UNSUBSCRIBE', uri, action);
  }
}
