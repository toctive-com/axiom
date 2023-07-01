export class Route {
  /**
   * All middleware functions are registered here to be executed when the route
   * is matched by the router.
   *
   */
  protected middlewareLayers: Function[] = [];

  /**
   * This property is used to store the name of a route.
   *
   */
  protected routeName: string | null = null;

  /**
   * Creates a new route
   *
   * @param {string[]} httpVerb - The `httpVerb` parameter is a string array that
   * represents the HTTP verbs (methods) that can be used for the request. For
   * example, it can include values like "GET", "POST", "PUT", "DELETE", etc.
   * @param {string[] | RegExp[]} uri - The `uri` parameter is a string array or a
   * regular expression array. It represents the URI or URIs that the route should
   * match.
   * @param {Function[] | null} action - The `action` parameter is an array of
   * functions that will be executed when the route is matched. It can be `null` if
   * no action is required for the route.
   *
   */
  constructor(
    protected httpVerb: string[],
    protected uri: string[] | RegExp[],
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
  public match(method: string, url: string): boolean {
    if (this.isHttpMethodAllowed(method) && this.isUriMatches(url)) {
      return this.isMiddlewareAllowed();
    }
    return false;
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
   * The "middleware" function adds a middleware layer to an array and returns the
   * updated array.
   *
   * @param {Function} middleware - The `middleware` parameter is a function that
   * represents a middleware layer.
   *
   * @returns Route instance.
   *
   */
  public middleware(middleware: Function): this {
    this.middlewareLayers.push(middleware);
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
  public called(name: string): this {
    this.routeName = name;
    return this;
  }
}
