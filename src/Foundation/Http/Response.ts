import { IncomingMessage, ServerResponse } from 'node:http';
import Application from '@/Foundation/Application';

export class HttpResponse extends ServerResponse<IncomingMessage> {
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
   * Prepares the contents to be sent, including setting headers and
   * converting the contents to a string if necessary.
   *
   * @param {unknown} [contents] - The `contents` parameter represents the data
   * that you want to send. It can be of any type, including objects, strings,
   * numbers, etc. If the `contents` parameter is not provided, the function
   * will still execute but without any data to send.
   *
   * @returns The method `prepareToSend` is returning `this`, which refers to the
   * current instance of the object.
   *
   */
  async prepareToSend(contents?: unknown): Promise<this> {
    await this.prepareHeaders(contents);
    await this.prepareBody(contents);

    return this;
  }

  /**
   * Prepares and appends various headers to the response object in
   * order to set up the appropriate configuration for the HTTP response.
   *
   * @param {unknown} [contents] - The `contents` parameter is of type `unknown`,
   * which means it can be any type of value. It is used to determine the content
   * type of the response and to prepare the appropriate headers for that content
   * type.
   *
   * @returns If the `headersSent` property is `true`, then nothing is returned.
   * The function will exit early and no further code will be executed.
   *
   */
  protected prepareHeaders(contents?: unknown): void {
    // this is to prevent the response from being sent twice if the content is undefined
    // and the response has not been sent yet. This can happen if the response is
    // sent from a middleware or sent manually using `response.end()`.
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

    // TODO check if the client accepts gzip
    // if (this.isAcceptsGzip()) {
    //   this.appendHeader("Content-Encoding", "gzip");
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
        // FIXME JSON.stringify is slow. Replace it with something faster like Typia
        // @see https://typia.io/docs/json/stringify/
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
   * The function prepares the headers for a response based on the type of content
   * provided.
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
}
