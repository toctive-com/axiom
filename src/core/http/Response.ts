import Application from '@/core/Application';
import { HttpStatusCode, HttpStatusMessage } from '@/types/HttpStatusCode';
import fs from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';
import stream from 'node:stream';

export class Response extends ServerResponse<IncomingMessage> {
  /**
   * The `app` property is used to store an instance of the`Application` class,
   * which represents the application being served by the HTTP server.
   *
   * @var Application
   *
   */
  public app: Application;

  /**
   * Ends the response to prepare it for termination
   *
   * @returns A Promise object is being returned.
   *
   */
  send(contents?: string): Promise<this> {
    return new Promise((resolve) => {
      if (contents) {
        this.end(contents, () => resolve(this));
      } else {
        this.end(() => resolve(this));
      }
    });
  }

  /**
   * Prepares the contents to be sent, including setting headers and converting
   * the contents to a string if necessary.
   *
   * @param {unknown} [contents] - The `contents` parameter represents the data
   * that you want to send. It can be of any type, including objects, strings,
   * numbers, etc. If the `contents` parameter is not provided, the function
   * will still execute but without any data to send.
   *
   * @returns The method `prepareToSend` is returning `this`, which refers to
   * the current instance of the object.
   *
   */
  async prepareToSend(contents?: unknown): Promise<this> {
    await this.prepareHeaders(contents);
    await this.prepareBody(contents);

    return this;
  }

  /**
   * Prepares and appends various headers to the response object in order to set
   * up the appropriate configuration for the HTTP response.
   *
   * @param {unknown} [contents] - The `contents` parameter is of type
   * `unknown`, which means it can be any type of value. It is used to determine
   * the content type of the response and to prepare the appropriate headers for
   * that content type.
   *
   * @returns If the `headersSent` property is `true`, then nothing is returned.
   * The function will exit early and no further code will be executed.
   *
   */
  protected prepareHeaders(contents?: unknown): void {
    // this is to prevent the response from being sent twice if the content is
    // undefined and the response has not been sent yet. This can happen if the
    // response is sent from a middleware or sent manually using
    // `response.end()`.
    if (this.headersSent) return;

    // TODO add all these headers in config files
    this.appendHeader('X-Powered-By', 'Axiom');
    this.appendHeader('Access-Control-Allow-Origin', '*');
    this.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    this.appendHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    this.appendHeader('Cache-Control', 'no-cache');
    this.appendHeader('Pragma', 'no-cache');
    this.appendHeader('Expires', '0');
    this.appendHeader('Connection', 'keep-alive');
    this.appendHeader('Keep-Alive', 'timeout=5, max=1000');
    this.appendHeader('Transfer-Encoding', 'chunked');
    this.appendHeader('Content-Language', 'en-US');

    // TODO check if the client accepts gzip if (this.isAcceptsGzip()) {
    // this.appendHeader("Content-Encoding", "gzip");
    // }

    this.prepareContentType(contents);
  }

  /**
   * Takes an optional `contents` parameter and returns a promise that resolves
   * when the contents are written to the response.
   *
   * @param {unknown} [contents]
   *
   * @returns Promise<void>.
   *
   */
  protected prepareBody(contents?: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof contents === 'object') {
        // FIXME JSON.stringify is slow. Replace it with something faster like
        // Typia @see https://typia.io/docs/json/stringify/
        this.write(JSON.stringify(contents), (err) =>
          err ? reject(err) : resolve(),
        );
      } else if (typeof contents === 'undefined') {
        this.write('', (err) => (err ? reject(err) : resolve()));
      } else {
        this.write(contents.toString(), (err) =>
          err ? reject(err) : resolve(),
        );
      }
    });
  }

  /**
   * The function prepares the headers for a response based on the type of
   * content provided.
   *
   * @param {unknown} contents - The `contents` parameter is of type `unknown`,
   * which means it can be any type. It is used to determine the appropriate
   * `Content-Type` header for the response based on the type of the `contents`
   * object.
   *
   * @returns The function does not have a return statement.
   *
   */
  protected prepareContentType(contents?: unknown): void {
    // if the response has already been sent, do nothing
    if (this.hasHeader('Content-Type')) return;

    // if the content is undefined, do nothing
    if (typeof contents === 'undefined') return;

    if (typeof contents === 'object') {
      this.appendHeader('Content-Type', 'application/json; charset=utf-8');
    } else if (typeof contents === 'object' && 'html' in contents) {
      this.appendHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (typeof contents === 'object' && 'xml' in contents) {
      this.appendHeader('Content-Type', 'application/xml; charset=utf-8');
    } else {
      this.appendHeader('Content-Type', 'text/plain; charset=utf-8');
    }
  }

  public addHeader(name: string, value: string): this {
    if (!this.headersSent) {
      return this.appendHeader(name, value);
    }
    console.warn("headers already sent and can't be modified.");
    return this;
  }

  /**
   * Set Links Header in the response.
   *
   * @param links - An object of links to be included in the Links Header.
   *
   * @example
   * ```typescript
   * const links = {
   *   self: 'https://example.com/resource/1',
   *   next: 'https://example.com/resource/2',
   * };
   * response.links(links);
   * ```
   */
  links(links: Record<string, string>): this {
    return this.appendHeader(
      'Link',
      Object.entries(links)
        .map(([rel, href]) => `<${href}>; rel="${rel}"`)
        .join(', '),
    );
  }

  /**
   * Download a file in response.
   *
   * @param filePath - The path to the file you want to download.
   * @param fileName - (Optional) The name to use for the downloaded file. If not provided, the original file name will be used.
   *
   * @example
   * ```typescript
   * // Download a file named "example.pdf"
   * response.downloadFile('/path/to/example.pdf');
   *
   * // Download a file with a custom name "my-document.pdf"
   * response.downloadFile('/path/to/document.docx', 'my-document.pdf');
   * ```
   */
  download(filePath: string, fileName?: string): void {
    const fileStream = fs.createReadStream(filePath);

    this.appendHeader('Content-Type', 'application/octet-stream');
    this.appendHeader(
      'Content-Disposition',
      `attachment; filename="${fileName || filePath}"`,
    );

    fileStream.pipe(this, { end: true });
  }

  /**
   * Download a stream to the client as a file.
   *
   * @param stream - The readable stream you want to download.
   * @param fileName - (Optional) The name to use for the downloaded file. If not provided, a generic name will be used.
   *
   * @example
   * ```typescript
   * // Create a readable stream (e.g., from a database query or an API)
   * const readStream = createReadStreamFromDatabase();
   *
   * // Download the stream as a file with a custom name "data.txt"
   * response.downloadStream(readStream, 'data.txt');
   * ```
   */
  downloadStream(downloadStream: stream.Readable, fileName?: string): void {
    this.appendHeader('Content-Type', 'application/octet-stream');
    this.appendHeader(
      'Content-Disposition',
      `attachment; filename="${fileName || 'downloaded-file'}"`,
    );

    downloadStream.pipe(this, { end: true });
  }

  /**
   * Sets the status code and status message of a response object based on a
   * provided code or message.
   *
   * @param codeOrMessage - Can accept either a string or a value from the
   * `Response.StatusCodes` object.
   *
   * @returns instance of the class.
   *
   */
  public setStatus(codeOrMessage: HttpStatusCode | HttpStatusMessage) {
    if (typeof codeOrMessage === 'string') {
      this.statusCode = Response.StatusCodes[codeOrMessage];
    } else {
      this.statusCode = codeOrMessage;
    }

    this.statusMessage = Response.StatusMessages[codeOrMessage];

    return this;
  }

  static StatusCodes = {
    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.2.1 | rfc7231#section-6.2.1}
     *
     * This interim response indicates that everything so far is OK and that the
     * client should continue with the request or ignore it if it is already
     * finished.
     */
    CONTINUE: 100,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.2.2 | rfc7231#section-6.2.2}
     *
     * This code is sent in response to an Upgrade request header by the client,
     * and indicates the protocol the server is switching too.
     */
    SWITCHING_PROTOCOLS: 101,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.1 | rfc2518#section-10.1}
     *
     * This code indicates that the server has received and is processing the
     * request, but no response is available yet.
     */
    PROCESSING: 102,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.1 | rfc7231#section-6.3.1}
     *
     * The request has succeeded. The meaning of a success varies depending on
     * the HTTP method: GET: The resource has been fetched and is transmitted in
     * the message body. HEAD: The entity headers are in the message body. POST:
     * The resource describing the result of the action is transmitted in the
     * message body. TRACE: The message body contains the request message as
     * received by the server
     */
    OK: 200,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.2 | rfc7231#section-6.3.2}
     *
     * The request has succeeded and a new resource has been created as a result
     * of it. This is typically the response sent after a PUT request.
     */
    CREATED: 201,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.3 | rfc7231#section-6.3.3}
     *
     * The request has been received but not yet acted upon. It is
     * non-committal, meaning that there is no way in HTTP to later send an
     * asynchronous response indicating the outcome of processing the request.
     * It is intended for cases where another process or server handles the
     * request, or for batch processing.
     */
    ACCEPTED: 202,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.4 | rfc7231#section-6.3.4}
     *
     * This response code means returned meta-information set is not exact set
     * as available from the origin server, but collected from a local or a
     * third party copy. Except this condition, 200 OK response should be
     * preferred instead of this response.
     */
    NON_AUTHORITATIVE_INFORMATION: 203,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.5 | rfc7231#section-6.3.5}
     *
     * There is no content to send for this request, but the headers may be
     * useful. The user-agent may update its cached headers for this resource
     * with the new ones.
     */
    NO_CONTENT: 204,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.3.6 | rfc7231#section-6.3.6}
     *
     * This response code is sent after accomplishing request to tell user agent
     * reset document view which sent this request.
     */
    RESET_CONTENT: 205,

    /**
     * {@link https://tools.ietf.org/html/rfc7233#section-4.1 | rfc7233#section-4.1}
     *
     * This response code is used because of range header sent by the client to
     * separate download into multiple streams.
     */
    PARTIAL_CONTENT: 206,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.2 | rfc2518#section-10.2}
     *
     * A Multi-Status response conveys information about multiple resources in
     * situations where multiple status codes might be appropriate.
     */
    MULTI_STATUS: 207,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.1 | rfc7231#section-6.4.1}
     *
     * The request has more than one possible responses. User-agent or user
     * should choose one of them. There is no standardized way to choose one of
     * the responses.
     */
    MULTIPLE_CHOICES: 300,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.2 | rfc7231#section-6.4.2}
     *
     * This response code means that URI of requested resource has been changed.
     * Probably, new URI would be given in the response.
     */
    MOVED_PERMANENTLY: 301,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.3 | rfc7231#section-6.4.3}
     *
     * This response code means that URI of requested resource has been changed
     * temporarily. New changes in the URI might be made in the future.
     * Therefore, this same URI should be used by the client in future requests.
     */
    MOVED_TEMPORARILY: 302,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.4 | rfc7231#section-6.4.4}
     *
     * Server sent this response to directing client to get requested resource
     * to another URI with an GET request.
     */
    SEE_OTHER: 303,

    /**
     * {@link https://tools.ietf.org/html/rfc7232#section-4.1 | rfc7232#section-4.1}
     *
     * This is used for caching purposes. It is telling to client that response
     * has not been modified. So, client can continue to use same cached version
     * of response.
     */
    NOT_MODIFIED: 304,

    /**
     * @deprecated
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.6 | rfc7231#section-6.4.6}
     *
     * Was defined in a previous version of the HTTP specification to indicate
     * that a requested response must be accessed by a proxy. It has been
     * deprecated due to security concerns regarding in-band configuration of a
     * proxy.
     */
    USE_PROXY: 305,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.4.7 | rfc7231#section-6.4.7}
     *
     * Server sent this response to directing client to get requested resource
     * to another URI with same method that used prior request. This has the
     * same semantic than the 302 Found HTTP response code, with the exception
     * that the user agent must not change the HTTP method used: if a POST was
     * used in the first request, a POST must be used in the second request.
     */
    TEMPORARY_REDIRECT: 307,

    /**
     * {@link https://tools.ietf.org/html/rfc7538#section-3 | rfc7538#section-3}
     *
     * This means that the resource is now permanently located at another URI,
     * specified by the Location: HTTP Response header. This has the same
     * semantics as the 301 Moved Permanently HTTP response code, with the
     * exception that the user agent must not change the HTTP method used: if a
     * POST was used in the first request, a POST must be used in the second
     * request.
     */
    PERMANENT_REDIRECT: 308,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.1 | rfc7231#section-6.5.1}
     *
     * This response means that server could not understand the request due to
     * invalid syntax.
     */
    BAD_REQUEST: 400,

    /**
     * {@link https://tools.ietf.org/html/rfc7235#section-3.1 | rfc7235#section-3.1}
     *
     * Although the HTTP standard specifies "unauthorized", semantically this
     * response means "unauthenticated". That is, the client must authenticate
     * itself to get the requested response.
     */
    UNAUTHORIZED: 401,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.2 | rfc7231#section-6.5.2}
     *
     * This response code is reserved for future use. Initial aim for creating
     * this code was using it for digital payment systems however this is not
     * used currently.
     */
    PAYMENT_REQUIRED: 402,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.3 | rfc7231#section-6.5.3}
     *
     * The client does not have access rights to the content, i.e. they are
     * unauthorized, so server is rejecting to give proper response. Unlike 401,
     * the client's identity is known to the server.
     */
    FORBIDDEN: 403,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.4 | rfc7231#section-6.5.4}
     *
     * The server can not find requested resource. In the browser, this means
     * the URL is not recognized. In an API, this can also mean that the
     * endpoint is valid but the resource itself does not exist. Servers may
     * also send this response instead of 403 to hide the existence of a
     * resource from an unauthorized client. This response code is probably the
     * most famous one due to its frequent occurence on the web.
     */
    NOT_FOUND: 404,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.5 | rfc7231#section-6.5.5}
     *
     * The request method is known by the server but has been disabled and
     * cannot be used. For example, an API may forbid DELETE-ing a resource. The
     * two mandatory methods, GET and HEAD, must never be disabled and should
     * not return this error code.
     */
    METHOD_NOT_ALLOWED: 405,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.6 | rfc7231#section-6.5.6}
     *
     * This response is sent when the web server, after performing server-driven
     * content negotiation, doesn't find any content following the criteria
     * given by the user agent.
     */
    NOT_ACCEPTABLE: 406,

    /**
     * {@link https://tools.ietf.org/html/rfc7235#section-3.2 | rfc7235#section-3.2}
     *
     * This is similar to 401 but authentication is needed to be done by a
     * proxy.
     */
    PROXY_AUTHENTICATION_REQUIRED: 407,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.7 | rfc7231#section-6.5.7}
     *
     * This response is sent on an idle connection by some servers, even without
     * any previous request by the client. It means that the server would like
     * to shut down this unused connection. This response is used much more
     * since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP
     * pre-connection mechanisms to speed up surfing. Also note that some
     * servers merely shut down the connection without sending this message.
     */
    REQUEST_TIMEOUT: 408,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.8 | rfc7231#section-6.5.8}
     *
     * This response is sent when a request conflicts with the current state of
     * the server.
     */
    CONFLICT: 409,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.9 | rfc7231#section-6.5.9}
     *
     * This response would be sent when the requested content has been
     * permenantly deleted from server, with no forwarding address. Clients are
     * expected to remove their caches and links to the resource. The HTTP
     * specification intends this status code to be used for "limited-time,
     * promotional services". APIs should not feel compelled to indicate
     * resources that have been deleted with this status code.
     */
    GONE: 410,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.10 | rfc7231#section-6.5.10}
     *
     * The server rejected the request because the Content-Length header field
     * is not defined and the server requires it.
     */
    LENGTH_REQUIRED: 411,

    /**
     * {@link https://tools.ietf.org/html/rfc7232#section-4.2 | rfc7232#section-4.2}
     *
     * The client has indicated preconditions in its headers which the server
     * does not meet.
     */
    PRECONDITION_FAILED: 412,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.11 | rfc7231#section-6.5.11}
     *
     * Request entity is larger than limits defined by server; the server might
     * close the connection or return an Retry-After header field.
     */
    REQUEST_TOO_LONG: 413,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.12 | rfc7231#section-6.5.12}
     *
     * The URI requested by the client is longer than the server is willing to
     * interpret.
     */
    REQUEST_URI_TOO_LONG: 414,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.13 | rfc7231#section-6.5.13}
     *
     * The media format of the requested data is not supported by the server, so
     * the server is rejecting the request.
     */
    UNSUPPORTED_MEDIA_TYPE: 415,

    /**
     * {@link https://tools.ietf.org/html/rfc7233#section-4.4 | rfc7233#section-4.4}
     *
     * The range specified by the Range header field in the request can't be
     * fulfilled; it's possible that the range is outside the size of the target
     * URI's data.
     */
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.5.14 | rfc7231#section-6.5.14}
     *
     * This response code means the expectation indicated by the Expect request
     * header field can't be met by the server.
     */
    EXPECTATION_FAILED: 417,

    /**
     * {@link https://tools.ietf.org/html/rfc2324#section-2.3.2 | rfc2324#section-2.3.2}
     *
     * Any attempt to brew coffee with a teapot should result in the error code
     * "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    IM_A_TEAPOT: 418,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.6 | rfc2518#section-10.6}
     *
     * The 507 (Insufficient Storage) status code means the method could not be
     * performed on the resource because the server is unable to store the
     * representation needed to successfully complete the request. This
     * condition is considered to be temporary. If the request which received
     * this status code was the result of a user action, the request MUST NOT be
     * repeated until it is requested by a separate user action.
     */
    INSUFFICIENT_SPACE_ON_RESOURCE: 419,

    /**
     * @deprecated
     * {@link https://tools.ietf.org/rfcdiff?difftype:--hwdiff&url2:draft-ietf-webdav-protocol-06.txt | difftype:--hwdiff&url2:draft-ietf-webdav-protocol-06.txt}
     *
     * A deprecated response used by the Spring Framework when a method has
     * failed.
     */
    METHOD_FAILURE: 420,

    /**
     * {@link https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2 | html/rfc7540#section-9.1.2}
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not
     * able to produce a response for the combination of scheme and authority
     * that are included in the request URI.
     */
    MISDIRECTED_REQUEST: 421,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.3 | rfc2518#section-10.3}
     *
     * The request was well-formed but was unable to be followed due to semantic
     * errors.
     */
    UNPROCESSABLE_ENTITY: 422,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.4 | rfc2518#section-10.4}
     *
     * The resource that is being accessed is locked.
     */
    LOCKED: 423,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.5 | rfc2518#section-10.5}
     *
     * The request failed due to failure of a previous request.
     */
    FAILED_DEPENDENCY: 424,

    /**
     * {@link https://tools.ietf.org/html/rfc6585#section-3 | rfc6585#section-3}
     *
     * The origin server requires the request to be conditional. Intended to
     * prevent the 'lost update' problem, where a client GETs a resource's
     * state, modifies it, and PUTs it back to the server, when meanwhile a
     * third party has modified the state on the server, leading to a conflict.
     */
    PRECONDITION_REQUIRED: 428,

    /**
     * {@link https://tools.ietf.org/html/rfc6585#section-4 | rfc6585#section-4}
     *
     * The user has sent too many requests in a given amount of time ("rate
     * limiting").
     */
    TOO_MANY_REQUESTS: 429,

    /**
     * {@link https://tools.ietf.org/html/rfc6585#section-5 | rfc6585#section-5}
     *
     * The server is unwilling to process the request because its header fields
     * are too large. The request MAY be resubmitted after reducing the size of
     * the request header fields.
     */
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

    /**
     * {@link https://tools.ietf.org/html/rfc7725 | rfc7725}
     *
     * The user-agent requested a resource that cannot legally be provided, such
     * as a web page censored by a government.
     */
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.1 | rfc7231#section-6.6.1}
     *
     * The server encountered an unexpected condition that prevented it from
     * fulfilling the request.
     */
    INTERNAL_SERVER_ERROR: 500,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.2 | rfc7231#section-6.6.2}
     *
     * The request method is not supported by the server and cannot be handled.
     * The only methods that servers are required to support (and therefore that
     * must not return this code) are GET and HEAD.
     */
    NOT_IMPLEMENTED: 501,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.3 | rfc7231#section-6.6.3}
     *
     * This error response means that the server, while working as a gateway to
     * get a response needed to handle the request, got an invalid response.
     */
    BAD_GATEWAY: 502,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.4 | rfc7231#section-6.6.4}
     *
     * The server is not ready to handle the request. Common causes are a server
     * that is down for maintenance or that is overloaded. Note that together
     * with this response, a user-friendly page explaining the problem should be
     * sent. This responses should be used for temporary conditions and the
     * Retry-After: HTTP header should, if possible, contain the estimated time
     * before the recovery of the service. The webmaster must also take care
     * about the caching-related headers that are sent along with this response,
     * as these temporary condition responses should usually not be cached.
     */
    SERVICE_UNAVAILABLE: 503,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.5 | rfc7231#section-6.6.5}
     *
     * This error response is given when the server is acting as a gateway and
     * cannot get a response in time.
     */
    GATEWAY_TIMEOUT: 504,

    /**
     * {@link https://tools.ietf.org/html/rfc7231#section-6.6.6 | rfc7231#section-6.6.6}
     *
     * The HTTP version used in the request is not supported by the server.
     */
    HTTP_VERSION_NOT_SUPPORTED: 505,

    /**
     * {@link https://tools.ietf.org/html/rfc2518#section-10.6 | rfc2518#section-10.6}
     *
     * The server has an internal configuration error: the chosen variant
     * resource is configured to engage in transparent content negotiation
     * itself, and is therefore not a proper end point in the negotiation
     * process.
     */
    INSUFFICIENT_STORAGE: 507,

    /**
     * {@link https://tools.ietf.org/html/rfc6585#section-6 | rfc6585#section-6}
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    NETWORK_AUTHENTICATION_REQUIRED: 511,
  } as const;

  static StatusMessages = {
    CONTINUE: 'Continue',
    100: 'Continue',

    SWITCHING_PROTOCOLS: 'Switching Protocols',
    101: 'Switching Protocols',

    PROCESSING: 'Processing',
    102: 'Processing',

    OK: 'Ok',
    200: 'Ok',

    CREATED: 'Created',
    201: 'Created',

    ACCEPTED: 'Accepted',
    202: 'Accepted',

    NON_AUTHORITATIVE_INFORMATION: 'Non Authoritative Information',
    203: 'Non Authoritative Information',

    NO_CONTENT: 'No Content',
    204: 'No Content',

    RESET_CONTENT: 'Reset Content',
    205: 'Reset Content',

    PARTIAL_CONTENT: 'Partial Content',
    206: 'Partial Content',

    MULTI_STATUS: 'Multi Status',
    207: 'Multi Status',

    MULTIPLE_CHOICES: 'Multiple Choices',
    300: 'Multiple Choices',

    MOVED_PERMANENTLY: 'Moved Permanently',
    301: 'Moved Permanently',

    MOVED_TEMPORARILY: 'Moved Temporarily',
    302: 'Moved Temporarily',

    SEE_OTHER: 'See Other',
    303: 'See Other',

    NOT_MODIFIED: 'Not Modified',
    304: 'Not Modified',

    USE_PROXY: 'Use Proxy',
    305: 'Use Proxy',

    TEMPORARY_REDIRECT: 'Temporary Redirect',
    307: 'Temporary Redirect',

    PERMANENT_REDIRECT: 'Permanent Redirect',
    308: 'Permanent Redirect',

    BAD_REQUEST: 'Bad Request',
    400: 'Bad Request',

    UNAUTHORIZED: 'Unauthorized',
    401: 'Unauthorized',

    PAYMENT_REQUIRED: 'Payment Required',
    402: 'Payment Required',

    FORBIDDEN: 'Forbidden',
    403: 'Forbidden',

    NOT_FOUND: 'Not Found',
    404: 'Not Found',

    METHOD_NOT_ALLOWED: 'Method Not Allowed',
    405: 'Method Not Allowed',

    NOT_ACCEPTABLE: 'Not Acceptable',
    406: 'Not Acceptable',

    PROXY_AUTHENTICATION_REQUIRED: 'Proxy Authentication Required',
    407: 'Proxy Authentication Required',

    REQUEST_TIMEOUT: 'Request Timeout',
    408: 'Request Timeout',

    CONFLICT: 'Conflict',
    409: 'Conflict',

    GONE: 'Gone',
    410: 'Gone',

    LENGTH_REQUIRED: 'Length Required',
    411: 'Length Required',

    PRECONDITION_FAILED: 'Precondition Failed',
    412: 'Precondition Failed',

    REQUEST_TOO_LONG: 'Request Too Long',
    413: 'Request Too Long',

    REQUEST_URI_TOO_LONG: 'Request Uri Too Long',
    414: 'Request Uri Too Long',

    UNSUPPORTED_MEDIA_TYPE: 'Unsupported Media Type',
    415: 'Unsupported Media Type',

    REQUESTED_RANGE_NOT_SATISFIABLE: 'Requested Range Not Satisfiable',
    416: 'Requested Range Not Satisfiable',

    EXPECTATION_FAILED: 'Expectation Failed',
    417: 'Expectation Failed',

    IM_A_TEAPOT: "I'm A Teapot",
    418: "I'm A Teapot",

    INSUFFICIENT_SPACE_ON_RESOURCE: 'Insufficient Space On Resource',
    419: 'Insufficient Space On Resource',

    METHOD_FAILURE: 'Method Failure',
    420: 'Method Failure',

    MISDIRECTED_REQUEST: 'Misdirected Request',
    421: 'Misdirected Request',

    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    422: 'Unprocessable Entity',

    LOCKED: 'Locked',
    423: 'Locked',

    FAILED_DEPENDENCY: 'Failed Dependency',
    424: 'Failed Dependency',

    PRECONDITION_REQUIRED: 'Precondition Required',
    428: 'Precondition Required',

    TOO_MANY_REQUESTS: 'Too Many Requests',
    429: 'Too Many Requests',

    REQUEST_HEADER_FIELDS_TOO_LARGE: 'Request Header Fields Too Large',
    431: 'Request Header Fields Too Large',

    UNAVAILABLE_FOR_LEGAL_REASONS: 'Unavailable For Legal Reasons',
    451: 'Unavailable For Legal Reasons',

    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    500: 'Internal Server Error',

    NOT_IMPLEMENTED: 'Not Implemented',
    501: 'Not Implemented',

    BAD_GATEWAY: 'Bad Gateway',
    502: 'Bad Gateway',

    SERVICE_UNAVAILABLE: 'Service Unavailable',
    503: 'Service Unavailable',

    GATEWAY_TIMEOUT: 'Gateway Timeout',
    504: 'Gateway Timeout',

    HTTP_VERSION_NOT_SUPPORTED: 'Http Version Not Supported',
    505: 'Http Version Not Supported',

    INSUFFICIENT_STORAGE: 'Insufficient Storage',
    507: 'Insufficient Storage',

    NETWORK_AUTHENTICATION_REQUIRED: 'Network Authentication Required',
    511: 'Network Authentication Required',
  } as const;
}
