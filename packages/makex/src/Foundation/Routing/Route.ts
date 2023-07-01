import { HttpRequest } from "../Http/Request";
import { HttpResponse } from "../Http/Response";

export class Route {
  /**
   * All middleware functions are registered here to be executed when the route
   * is matched by the router.
   *
   * @var Function[]
   *
   */
  protected middlewareLayers: Function[] = [];

  /**
   * This property is used to store the name of a route.
   *
   * @var {string | null}
   *
   */
  protected routeName: string | null = null;

  /**
   * This property is used to store the name of a route.
   *
   * @var {string | null}
   *
   */
  protected prefixUri: string | null = null;

  /**
   * Creates a new route
   *
   * @param {string[]} httpVerb - The `httpVerb` parameter is a string array that
   * represents the HTTP verbs (methods) that can be used for the request. For
   * example, it can include values like "GET", "POST", "PUT", "DELETE", etc.
   * @param {string[]} uri - The `uri` parameter is a string array or a
   * regular expression array. It represents the URI or URIs that the route should
   * match.
   * @param {Function[] | null} action - The `action` parameter is an array of
   * functions that will be executed when the route is matched. It can be `null` if
   * no action is required for the route.
   *
   */
  constructor(
    protected httpVerb: string[],
    protected uri: string[],
    protected action: Function[] | null
  ) {}

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
  public match(method: string, url: string): this | false {
    // `isMiddlewareAllowed()` must be called after all other checker. So, we
    // don't call every middleware on every route
    return this.isHttpMethodAllowed(method) &&
      this.isUriMatches(url) &&
      this.isMiddlewareAllowed()
      ? this
      : false;
  }

  /**
   * The function checks if a given HTTP method is allowed.
   *
   * @param {string} httpMethod - The `httpMethod` parameter is a string that
   * represents an HTTP method, such as "GET", "POST", "PUT", "DELETE", etc.
   *
   * @returns a boolean value.
   *
   */
  public isHttpMethodAllowed(httpMethod: string): boolean {
    return this.httpVerb.includes(httpMethod);
  }

  /**
   * The function checks if a given URI matches any of the regular expressions or
   * strings in an array.
   *
   * @param {string} uri - The `uri` parameter is a string that represents a URI
   * (Uniform Resource Identifier).
   *
   * @returns a boolean value.
   *
   */
  public isUriMatches(uri: string): boolean {
    return this.uri.some((regex: string | RegExp) =>
      regex instanceof RegExp ? regex.test(uri) : regex === uri
    );
  }

  /**
   * The function checks if all middleware layers are allowed.
   *
   * @returns A boolean value
   *
   */
  public isMiddlewareAllowed(): boolean {
    return this.middlewareLayers.every((middleware: Function) => middleware());
  }

  /**
   * execute
   */
  /**
   * The execute function iterates over a list of actions and calls each action with
   * the next action, request, and response objects.
   *
   * @param {HttpRequest} request - The `request` parameter is an object that
   * represents the incoming HTTP request. It typically contains information such as
   * the request method (GET, POST, etc.), headers, query parameters, and request
   * body.
   * @param {HttpResponse} response - The `response` parameter is an object that
   * represents the HTTP response that will be sent back to the client. It typically
   * contains information such as the status code, headers, and the response body.
   *
   * @returns The result of calling action functions.
   *
   */
  public execute(request: HttpRequest, response: HttpResponse) {
    for (let i = 0; i < this.action.length; i++) {
      const action = this.action[i];
      const nextAction = this.action[i + 1];
      return action({ next: nextAction, request, response });
    }
  }

  /**
   * The "middleware" function adds a middleware layer to an array and returns the
   * updated array.
   *
   * @param {Function} middleware - The `middleware` parameter is a function that
   * represents a middleware layer.
   *
   * @returns Route instance.
   *
   */
  public middleware(
    middleware: Function | Function[] | string | string[]
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
   * The function sets the route name and returns the object.
   *
   * @param {string} name - The name parameter is a string that represents the name
   * of a route.
   *
   * @returns Route instance.
   *
   */
  public named(name: string): this {
    this.routeName = name;
    return this;
  }

  /**
   * Sets the prefixUri property of an object and returns the object itself.
   *
   * @param {string} name - a string that represents the prefix URI.
   *
   * @returns Route instance.
   *
   */
  public prefix(name: string): this {
    this.prefixUri = name;
    return this;
  }
}
