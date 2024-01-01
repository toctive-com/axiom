import { Middleware, Request, Response } from '@/core';
import { Instantiable, RouteActionParameters } from '@/types';
import { Url, makeFunctionsChain } from '@/utils';

/**
 * The `Route` class represents a route in a web application and provides
 * methods for matching the route, executing actions, and adding middleware
 * layers.
 */
export class Route {
  /**
   * All middleware functions are registered here to be executed when the route
   * is matched by the router.
   */
  protected middlewareLayers: Function[] = [];

  /**
   * The name of the route.
   */
  protected routeName: string | null = null;

  /**
   * The prefix URI for the route.
   */
  private _prefixUri: string = '';
  public get prefixUri(): string {
    return this._prefixUri;
  }

  private _tempActions: typeof this.actions;

  /**
   * Creates a new route.
   * @param httpMethods The HTTP verbs (methods) that can be used for the
   * request.
   * @param uri The URI or URIs that the route should match.
   * @param actions Functions to be executed when the route is matched.
   */
  constructor(
    public httpMethods: string[],
    public uri: string[],
    public actions: (Function | typeof Middleware)[],
  ) {
    this.uri = uri.map((item) => Url.trim(item));
  }

  /**
   * Checks if the given HTTP method and URL match the allowed criteria and
   * returns whether the middleware is allowed or not.
   */
  public async match(
    request: Request,
    response: Response,
  ): Promise<this | false> {
    const { method } = request;

    return this.isHttpMethodAllowed(method) &&
      this.isMatchPrefix(request) &&
      this.isUriMatches(request) &&
      (await this.isMiddlewareAllowed(request, response))
      ? this
      : false;
  }

  /**
   * Checks if a given HTTP method is allowed.
   */
  public isHttpMethodAllowed(httpMethod: string): boolean {
    return this.httpMethods.includes(httpMethod.toUpperCase());
  }

  /**
   * Checks if a given URI matches any of the regular expressions or strings in
   * an array.
   */
  public isUriMatches(request: Request): boolean {
    let url = Url.trim(
      new URL(request.url, 'http://localhost/').pathname,
    ).replace(this.prefixUri, '');

    return this.getMatchedUri(url) !== null;
  }

  /**
   * Checks if the request URL matches the route's prefix.
   */
  public isMatchPrefix = (request: Request): boolean => {
    return Url.trim(
      new URL(request.url, 'http://localhost/').pathname,
    ).startsWith(this.prefixUri);
  };

  /**
   * Extracts variables from a given original URL and current URL.
   */
  public extractVariables(originalUrl: string, currentUrl: string) {
    const originalUrlParts = originalUrl.split('/');
    const currentUrlParts = currentUrl.split('/');
    const variables = {};
    for (let i = 0; i < originalUrlParts.length; i++) {
      if (
        originalUrlParts[i].startsWith('{') &&
        originalUrlParts[i].endsWith('}')
      ) {
        variables[
          originalUrlParts[i].substring(1, originalUrlParts[i].length - 1)
        ] = currentUrlParts[i];
      } else if (originalUrlParts[i].startsWith(':')) {
        variables[originalUrlParts[i].substring(1)] = currentUrlParts[i];
      }
    }
    return variables;
  }

  /**
   * Gets the matched URI from a list of URIs.
   */
  getMatchedUri(currentUrl: string): string | null {
    for (const uri of this.uri) {
      const regexPattern = `^${uri
        .replace(/{[a-zA-Z0-9_-]+}/g, '(?!.*\\/)(.+)')
        .replace(/:\w+/g, '(?!.*\\/)(.+)')}$`;

      const regex = new RegExp(regexPattern);

      if (regex.test(currentUrl)) return uri;
    }
    return null;
  }

  /**
   * Checks if all middleware layers are allowed.
   */
  public async isMiddlewareAllowed(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const stack = makeFunctionsChain([...this.middlewareLayers, () => true], {
      request,
      response,
      req: request,
      res: response,
    });
    return await stack();
  }

  /**
   * Executes a list of actions with request, response, and variables.
   */
  public async dispatch(
    request: Request,
    response: Response,
    next: Function | typeof Middleware = () => {},
  ) {
    const url = Url.trim(
      new URL(request.url, 'http://localhost/').pathname,
    ).replace(this.prefixUri, '');
    const matchedUri = this.getMatchedUri(url);

    if (matchedUri !== null) {
      const variables = this.extractVariables(matchedUri, url);
      request.params = variables;

      this._tempActions = [...this.actions, next];

      const processedActions = this._tempActions.map((action) => {
        if (action.prototype instanceof Middleware) {
          return (params: RouteActionParameters) => {
            const routeAction = new (action as Instantiable & Middleware)(
              params,
            ).getAction();

            return routeAction(params);
          };
        } else {
          return action;
        }
      });

      return await this.callFunctions(
        processedActions,
        request,
        response,
        variables,
      );
    }
  }

  /**
   * Recursively calls a list of functions, passing in the request and response
   * objects, until all functions have been called.
   */
  async callFunctions(
    functions: (Function | Middleware)[],
    request: Request,
    response: Response,
    rest: { [key: string]: any },
  ) {
    if (functions.length === 0) return;
    const currentFunc = functions.shift();
    if (currentFunc instanceof Middleware) {
      return await (currentFunc as Middleware).validate({
        app: request.app,
        request,
        req: request,
        response,
        res: response,
        next: () => {
          return this.callFunctions(functions, request, response, rest);
        },
      });
    } else {
      return await currentFunc({
        next: async () =>
          await this.callFunctions(functions, request, response, rest),
        request,
        response,
        req: request,
        res: response,
        app: request.app,
        ...rest,
      });
    }
  }

  /**
   * Adds a middleware layer to the route.
   */
  public middleware(
    middleware: Function | Function[] | string | string[],
  ): this {
    if (middleware instanceof Function) {
      this.middlewareLayers.push(middleware);
    } else if (middleware instanceof Array && middleware.length > 0) {
      for (const item of middleware) {
        if (item instanceof Function) {
          this.middlewareLayers.push(item);
        }
        // TODO add support for string middleware
      }
    }
    return this;
  }

  /**
   * Sets the name of the route.
   */
  public named(name: string): this {
    this.routeName = name;
    return this;
  }

  /**
   * Sets the prefix URI of the route.
   */
  public prefix(prefix: string): this {
    this._prefixUri = Url.trim(prefix);
    return this;
  }
}
