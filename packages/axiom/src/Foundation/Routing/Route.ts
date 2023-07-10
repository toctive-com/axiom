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
      regex instanceof RegExp ? regex.test(uri) : this.getMatchedUri(uri)
    );
  }

  /**
   * Extracts variables from a given original URL and current URL by
   * comparing their respective parts.
   *
   * @param {string} originalUrl - The originalUrl parameter is a string that
   * represents the original URL. It is the URL pattern that contains variables in
   * the form of `:variableName` or `{variableName}`.
   * For example, `/users/:userId` or `/users/{userId}` 
   * or `/users/{user-Id}/posts/:postId`
   * @param {string} currentUrl - The `currentUrl` parameter is the URL that is
   * currently being accessed or visited.
   *
   * @returns an object containing variables extracted from the original URL and
   * their corresponding values from the current URL.
   *
   */
  protected extractVariables(originalUrl: string, currentUrl: string) {
    const originalUrlParts = originalUrl.split("/");
    const currentUrlParts = currentUrl.split("/");
    const variables = {};
    for (let i = 0; i < originalUrlParts.length; i++) {
      if (
        originalUrlParts[i].startsWith("{") &&
        originalUrlParts[i].endsWith("}")
      ) {
        variables[
          originalUrlParts[i].substring(1, originalUrlParts[i].length - 1)
        ] = currentUrlParts[i];
      } else if (originalUrlParts[i].startsWith(":")) {
        variables[originalUrlParts[i].substring(1)] = currentUrlParts[i];
      }
    }
    return variables;
  }

  /**
   * The function `getMatchedUri` takes a current URL and returns the matching URI
   * from a list of URIs.
   *
   * @param {string} currentUrl - The `currentUrl` parameter is a string
   * representing the current URL that you want to match against a list of URIs.
   *
   * @returns the matched URI if it exists in the `this.uri` array. If no match is
   * found, it returns `null`.
   *
   */
  getMatchedUri(currentUrl: string) {
    for (const uri of this.uri) {
      const regex = new RegExp(
        `^${uri
          .replace(/{[a-zA-Z0-9_-]+}/g, "[a-zA-Z0-9_-]+")
          .replace(/:\w+/g, "\\w+")}$`
      );

      if (regex.test(currentUrl)) return uri;
    }
    return null;
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
    const variables = this.extractVariables(
      this.getMatchedUri(request.url),
      request.url
    );
    request.params = variables;
    return this.callFunctions(this.action, request, response, variables);
  }

  /**
   * Recursively calls a list of functions, passing in the request and response
   * objects, until all functions have been called.
   *
   * @param {Function[]} functions - An array of functions that will be called
   * one by one.
   * @param {HttpRequest} request
   * @param {HttpResponse} response
   *
   * @returns The current function is being returned.
   *
   */
  callFunctions(
    functions: Function[],
    request: HttpRequest,
    response: HttpResponse,
    rest: { [key: string]: any }
  ) {
    if (functions.length === 0) return;
    const currentFunc = functions.shift();
    return currentFunc({
      next: () => this.callFunctions(functions, request, response, rest),
      request,
      response,
      req: request,
      res: response,
      app: request.app,
      ...rest,
    });
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
