import Application from '@/Core/Application';
import { HttpRequest } from '@/Core/Http/Request';
import { HttpResponse } from '@/Core/Http/Response';
import { HttpTerminator, createHttpTerminator } from 'http-terminator';
import { Server } from 'node:http';
import setPrototypeOf from 'setprototypeof';

export class HttpKernel {
  /**
   * The `app` property is used to store an instance of the`Application` class,
   * which represents the application being served by the HTTP server.
   *
   * @var Application
   *
   */
  public readonly app: Application;

  /**
   * This property is used to store an instance of the `Server` class, which is
   * used to create an HTTP server.
   *
   * @var Server
   *
   */
  protected server: Server;

  /**
   * This property is used to store an instance of the `HttpTerminator` class,
   * which is used to gracefully shut down the HTTP server.
   *
   * @var HttpTerminator
   *
   */
  protected httpTerminator: HttpTerminator;

  /**
   * Creates a server and starts it on port 8000, while also creating
   * an httpTerminator to gracefully shut down the server.
   *
   * @param Server
   *
   */
  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Captures an HTTP request and returns a promise that resolves with
   * the request and its corresponding response.
   *
   * @returns A Promise that resolves to an object containing an HttpRequest and an
   * HttpResponse.
   *
   */
  async captureRequest() {
    return new Promise<void>(async (resolve, reject) => {
      let port = this.app.config('server.port', 8000);
      const hostname = this.app.config('server.host', 'localhost');

      const server = (this.server = this.app.createServer(async (req, res) => {
        const request: HttpRequest = setPrototypeOf(req, HttpRequest.prototype);
        const response: HttpResponse = setPrototypeOf(
          res,
          HttpResponse.prototype,
        );

        request.app = this.app;
        response.app = this.app;

        Application.set('HttpRequest', () => request);
        Application.set('HttpResponse', () => response);

        const result = await this.handle(request, response);
        result.send();
        resolve();
      }));

      this.httpTerminator = createHttpTerminator({ server });

      server.listen(port, hostname, () => {
        console.log(`server started on http://${hostname}:${port}/`);
      });

      server.on('error', (error: Error & { code: string }) => {
        if (
          error.code === 'EADDRINUSE' &&
          this.app.config('server.incrementalPort', true)
        ) {
          console.log(
            `The port ${port} is already in use. Axiom will try the port ${
              port + 1
            }`,
          );
          port++;
          server.listen(port, hostname);
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * Handles an HTTP request and returns an HTTP response.
   *
   * @param {HttpRequest} request - HttpRequest is an object that represents an HTTP
   * request made by a client to a server. It contains information such as the
   * request method, headers, and body.
   * @param {HttpResponse} response - The `response` parameter is an instance of the
   * `HttpResponse` class, which is used to send a response back to the client that
   * made the HTTP request. It contains information such as the status code, headers,
   * and body of the response. In the given code snippet, the `handle` function
   *
   * @returns The `response` object is being returned.
   *
   */
  async handle(
    request: HttpRequest,
    response: HttpResponse,
  ): Promise<HttpResponse> {
    /**
     * Check If The Application Is Under Maintenance
     * --------------------------------------------------------------------------
     * If there is a file called `down` in this project directory,
     * This means the website is under maintenance and all incoming request will
     * get 503 status code.
     *
     */
    await request.app.handleMaintenanceMode({ request, response });

    await this.executeSequence(this.app.middleware, request, response);

    return response;
  }

  async executeSequence(
    functions: Function[],
    request: HttpRequest,
    response: HttpResponse,
  ) {
    const tempFunctionArray = [...functions];
    const func = tempFunctionArray.shift();
    if (func !== undefined && typeof func === 'function') {
      await func(request, response, async () => {
        return await this.executeSequence(tempFunctionArray, request, response);
      });
    }
  }

  /**
   * Terminates an HTTP server using an HTTP terminator.
   *
   * @param {HttpRequest} request - HttpRequest is an object that represents an
   * incoming HTTP request. It contains information such as the request method,
   * headers, URL, and body.
   * @param {HttpResponse} response - The `response` parameter is an instance of the
   * `HttpResponse` class, which represents the HTTP response that will be sent back
   * to the client. It contains information such as the status code, headers, and
   * body of the response. In this case, it is not being used directly in the
   * `terminate
   *
   */
  async terminate(request: HttpRequest, response: HttpResponse) {
    await this.httpTerminator.terminate();
  }
}
