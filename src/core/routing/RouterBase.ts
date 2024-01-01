import { Middleware } from '@/core';
import { HttpMethod } from '@/types';
import { Arr, Url } from '@/utils';
import { Route } from './Route';
import { RoutesGroup } from './RoutesGroup';

export type AcceptedURI = string | string[];
export type AcceptedAction = typeof Middleware | Function;
export type RouteFunction = (
  uri: AcceptedURI,
  ...action: AcceptedAction[]
) => Route;

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
    uris: AcceptedURI,
    actions: AcceptedAction[],
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
   * @returns Route
   *
   */
  public all: RouteFunction = (uri, ...action) => {
    return this.any(uri, ...action);
  };

  /**
   * Create a new route with all HTTP verbs and store it in Router routes
   * @returns Route
   *
   */
  public any: RouteFunction = (uri, ...action) => {
    return this.addRoute(RouterBase.httpMethods, uri, action);
  };

  /**
   * Create a new route with one or more HTTP verbs and store it in Router
   * routes.
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
    uri: AcceptedURI,
    ...action: AcceptedAction[]
  ) {
    return this.addRoute(httpMethods, uri, action);
  }

  /**
   * Create a new Acl route and store it in Router routes
   * @returns Route
   *
   */
  public acl: RouteFunction = (uri, ...action) => {
    return this.addRoute('ACL', uri, action);
  };

  /**
   * Create a new Bind route and store it in Router routes
   * @returns Route
   *
   */
  public bind: RouteFunction = (uri, ...action) => {
    return this.addRoute('BIND', uri, action);
  };

  /**
   * Create a new Checkout route and store it in Router routes
   * @returns Route
   *
   */
  public checkout: RouteFunction = (uri, ...action) => {
    return this.addRoute('CHECKOUT', uri, action);
  };

  /**
   * Create a new Connect route and store it in Router routes
   * @returns Route
   *
   */
  public connect: RouteFunction = (uri, ...action) => {
    return this.addRoute('CONNECT', uri, action);
  };

  /**
   * Create a new Copy route and store it in Router routes
   * @returns Route
   *
   */
  public copy: RouteFunction = (uri, ...action) => {
    return this.addRoute('COPY', uri, action);
  };

  /**
   * Create a new Delete route and store it in Router routes
   * @returns Route
   *
   */
  public delete: RouteFunction = (uri, ...action) => {
    return this.addRoute('DELETE', uri, action);
  };

  /**
   * Create a new Get route and store it in Router routes
   * @returns Route
   *
   */
  public get: RouteFunction = (uri, ...action) => {
    return this.addRoute(['GET', 'HEAD'], uri, action);
  };

  /**
   * Create a new Get route without HEAD HTTP method and store it in Router
   * routes
   * @returns Route
   *
   */
  public getOnly: RouteFunction = (uri, ...action) => {
    return this.addRoute('GET', uri, action);
  };

  /**
   * Create a new Head route and store it in Router routes
   * @returns Route
   *
   */
  public head: RouteFunction = (uri, ...action) => {
    return this.addRoute('HEAD', uri, action);
  };

  /**
   * Create a new Link route and store it in Router routes
   * @returns Route
   *
   */
  public link: RouteFunction = (uri, ...action) => {
    return this.addRoute('LINK', uri, action);
  };

  /**
   * Create a new Lock route and store it in Router routes
   * @returns Route
   *
   */
  public lock: RouteFunction = (uri, ...action) => {
    return this.addRoute('LOCK', uri, action);
  };

  /**
   * Create a new Merge route and store it in Router routes
   * @returns Route
   *
   */
  public merge: RouteFunction = (uri, ...action) => {
    return this.addRoute('MERGE', uri, action);
  };

  /**
   * Create a new Mkactivity route and store it in Router routes
   * @returns Route
   *
   */
  public mkactivity: RouteFunction = (uri, ...action) => {
    return this.addRoute('MKACTIVITY', uri, action);
  };

  /**
   * Create a new Mkcalendar route and store it in Router routes
   * @returns Route
   *
   */
  public mkcalendar: RouteFunction = (uri, ...action) => {
    return this.addRoute('MKCALENDAR', uri, action);
  };

  /**
   * Create a new Mkcol route and store it in Router routes
   * @returns Route
   *
   */
  public mkcol: RouteFunction = (uri, ...action) => {
    return this.addRoute('MKCOL', uri, action);
  };

  /**
   * Create a new Move route and store it in Router routes
   * @returns Route
   *
   */
  public move: RouteFunction = (uri, ...action) => {
    return this.addRoute('MOVE', uri, action);
  };

  /**
   * Create a new Notify route and store it in Router routes
   * @returns Route
   *
   */
  public notify: RouteFunction = (uri, ...action) => {
    return this.addRoute('NOTIFY', uri, action);
  };

  /**
   * Create a new Options route and store it in Router routes
   * @returns Route
   *
   */
  public options: RouteFunction = (uri, ...action) => {
    return this.addRoute('OPTIONS', uri, action);
  };

  /**
   * Create a new Patch route and store it in Router routes
   * @returns Route
   *
   */
  public patch: RouteFunction = (uri, ...action) => {
    return this.addRoute('PATCH', uri, action);
  };

  /**
   * Create a new Post route and store it in Router routes
   * @returns Route
   *
   */
  public post: RouteFunction = (uri, ...action) => {
    return this.addRoute('POST', uri, action);
  };

  /**
   * Create a new Propfind route and store it in Router routes
   * @returns Route
   *
   */
  public propfind: RouteFunction = (uri, ...action) => {
    return this.addRoute('PROPFIND', uri, action);
  };

  /**
   * Create a new Proppatch route and store it in Router routes
   * @returns Route
   *
   */
  public proppatch: RouteFunction = (uri, ...action) => {
    return this.addRoute('PROPPATCH', uri, action);
  };

  /**
   * Create a new Purge route and store it in Router routes
   * @returns Route
   *
   */
  public purge: RouteFunction = (uri, ...action) => {
    return this.addRoute('PURGE', uri, action);
  };

  /**
   * Create a new Put route and store it in Router routes
   * @returns Route
   *
   */
  public put: RouteFunction = (uri, ...action) => {
    return this.addRoute('PUT', uri, action);
  };

  /**
   * Create a new Rebind route and store it in Router routes
   * @returns Route
   *
   */
  public rebind: RouteFunction = (uri, ...action) => {
    return this.addRoute('REBIND', uri, action);
  };

  /**
   * Create a new Report route and store it in Router routes
   * @returns Route
   *
   */
  public report: RouteFunction = (uri, ...action) => {
    return this.addRoute('REPORT', uri, action);
  };

  /**
   * Create a new Search route and store it in Router routes
   * @returns Route
   *
   */
  public search: RouteFunction = (uri, ...action) => {
    return this.addRoute('M-SEARCH', uri, action);
  };

  /**
   * Create a new Search route and store it in Router routes
   * @returns Route
   *
   */
  public mSearch: RouteFunction = (uri, ...action) => {
    return this.addRoute('M-SEARCH', uri, action);
  };

  /**
   * Create a new Source route and store it in Router routes
   * @returns Route
   *
   */
  public source: RouteFunction = (uri, ...action) => {
    return this.addRoute('SOURCE', uri, action);
  };

  /**
   * Create a new Subscribe route and store it in Router routes
   * @returns Route
   *
   */
  public subscribe: RouteFunction = (uri, ...action) => {
    return this.addRoute('SUBSCRIBE', uri, action);
  };

  /**
   * Create a new Trace route and store it in Router routes
   * @returns Route
   *
   */
  public trace: RouteFunction = (uri, ...action) => {
    return this.addRoute('TRACE', uri, action);
  };

  /**
   * Create a new Unbind route and store it in Router routes
   * @returns Route
   *
   */
  public unbind: RouteFunction = (uri, ...action) => {
    return this.addRoute('UNBIND', uri, action);
  };

  /**
   * Create a new Unlink route and store it in Router routes
   * @returns Route
   *
   */
  public unlink: RouteFunction = (uri, ...action) => {
    return this.addRoute('UNLINK', uri, action);
  };

  /**
   * Create a new Unlock route and store it in Router routes
   * @returns Route
   *
   */
  public unlock: RouteFunction = (uri, ...action) => {
    return this.addRoute('UNLOCK', uri, action);
  };

  /**
   * Create a new Unsubscribe route and store it in Router routes
   * @returns Route
   *
   */
  public unsubscribe: RouteFunction = (uri, ...action) => {
    return this.addRoute('UNSUBSCRIBE', uri, action);
  };
}
