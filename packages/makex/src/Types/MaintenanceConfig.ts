export interface MaintenanceConfig {
  /**
   * All routes that will remain working even in maintenance mode.
   *
   * @example ```["/api/v3/*", "/"]```
   *
   * @var string[]
   *
   */
  except?: string[];

  /**
   * Redirect all incoming requests to absolute or relative URL.
   *
   * @description This is done by sending the Location HTTP response header that
   * tells the client to redirect to another URL.
   *
   * This will override the status code in this configuration to `302 Found` not
   * `503 Service Unavailable` which means temporarily redirecting to another URL.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302
   *
   * @var {string | null}
   *
   */
  redirect?: string | null;

  /**
   * Refresh header that will tell the browser to refresh the page every X seconds.
   *
   * @description This HTTP header is not standard but it's commonly
   * used on the web and supported in every web browser.
   *
   * This header also accepts a URL value to redirect to after X seconds:
   * `Refresh: 5; url=https://example.com/`.
   *
   * @see https://stackoverflow.com/questions/283752/refresh-http-header
   * @see https://en.wikipedia.org/wiki/Meta_refresh
   *
   * @example `60`, or `60; url=https://example.com/`
   *
   * @var {number | string | null}
   *
   */
  refresh?: number | string | null;

  /**
   * Retry-After header that will be sent to the client.
   *
   * @description Retry-After is a response HTTP header that tells the client how
   * long he should wait before making a follow-up request.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
   *
   * @var {number | string | null}
   *
   */
  retry?: number | string | null;

  /**
   * This a secret key that should be sent within a cookie to access the
   * application even in maintenance mode. That helps the developers to continue
   * develop and test the application without the need to turn the maintenance
   * mode off.
   *
   * @var {string | null}
   *
   */
  secret?: string | null;

  /**
   * HTTP response status code that will be sent within all HTTP responses during
   * maintenance mode is on.
   *
   * The default value is `503 Service Unavailable`.
   *
   * @default 503
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
   *
   * @var number
   *
   */
  status: number;

  /**
   * A string that represents the body of the response that will be sent to the
   * client. This can be just a string or an HTML code that will be rendered in
   * the browser.
   *
   * @default ```<h1>Website is under maintenance</h1>```
   *
   * @var {string | null}
   *
   */
  template: string | null;
}
